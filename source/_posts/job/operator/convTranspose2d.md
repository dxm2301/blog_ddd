---
title: ConvTranspose2d
data: 2024.04.20 18:00
cover: wp_0005.jpg
categories:
- [Job, 算子开发]
tags:
- Conv2d
- ConvTranspose2d

---

# ConvTranspose2d
## Research
> - pytorch文档: [conv2d](https://pytorch.org/docs/stable/generated/torch.nn.Conv2d.html#torch.nn.Conv2d)
> - pytorch文档: [convTranspose2d](https://pytorch.org/docs/stable/generated/torch.nn.ConvTranspose2d.html#torch.nn.ConvTranspose2d)

### convTranspose2d参数

```python
torch.nn.ConvTranspose2d(in_channels, out_channels, kernel_size, stride=1, padding=0, output_padding=0, groups=1, bias=True, dilation=1, padding_mode='zeros', device=None, dtype=None)
```

- Parameters
  - in_channels (int) – Number of channels in the input image
  - out_channels (int) – Number of channels produced by the convolution
  - kernel_size (int or tuple) – Size of the convolving kernel
  - stride (int or tuple, optional) – Stride of the convolution. Default: 1
  - padding (int or tuple, optional) – dilation * (kernel_size - 1) - padding zero-padding will be added to both sides of each dimension in the input. Default: 0
  - output_padding (int or tuple, optional) – Additional size added to one side of each dimension in the output shape. Default: 0
  - groups (int, optional) – Number of blocked connections from input channels to output channels. Default: 1
  - bias (bool, optional) – If True, adds a learnable bias to the output. Default: True
  - dilation (int or tuple, optional) – Spacing between kernel elements. Default: 1

### convTranspose2d行为
> - 反卷积可视化：[convTranspose2d可视化流程](https://github.com/vdumoulin/conv_arithmetic/blob/master/README.md)
- conv2d实现convTranspose2d步骤：
  - Step1: 对input_deconv做swelling操作 ===> input_conv;
  - Step2: 对weight_deconv做transpose操作 ===> weight_conv;
  - Step3：使用weight_conv在input_conv上做常规conv2d操作;

## Implement
### input swelling
![ct_001](ct_001.jpg "input swelling")

### weight pattern
![ct_002](ct_002.jpg "weight pattern")

### 验证
#### python脚本
```python
import torch
import torch.nn as nn
import numpy as np

# 设置打印选项
torch.set_printoptions(linewidth=10000)

# 定义测试用例
TEST_CASES = {
    "CASE_1": {"N": 1, "IC": 1, "IH": 5, "IW": 5, "OC": 1, "stride": 3, "kernel": 3, "padding": 0, "output_padding": 0},
    "CASE_2": {"N": 1, "IC": 1, "IH": 4, "IW": 6, "OC": 1, "stride": 2, "kernel": 3, "padding": 1, "output_padding": 1}
}

# 选择一个测试用例
CASE = "CASE_1"
params = TEST_CASES[CASE]

# 从测试用例中获取参数
N, IC, IH, IW = params["N"], params["IC"], params["IH"], params["IW"]
OC = IC
total_size = N * IC * IH * IW
stride, kernel, padding, output_padding = params["stride"], params["kernel"], params["padding"], params["output_padding"]
padding_conv2d = kernel - padding - 1

def create_tensor(total_size):
    """创建一个随机张量"""
    tensor = torch.randint(0, 256, (total_size,)).float() - 128
    return tensor.view(N, IC, IH, IW)

def initialize_weights(OC, IC, kernel):
    """初始化权重"""
    new_weights = torch.Tensor(OC, IC, kernel, kernel)
    for i in range(kernel):
        for j in range(kernel):
            new_weights[:, :, i, j] = i * kernel + j + 1
    return new_weights

def create_conv_transpose(IC, OC, kernel, stride, padding, output_padding, bias=torch.zeros(IC)):
    """创建一个卷积转置层"""
    conv_transpose = nn.ConvTranspose2d(IC, OC, kernel_size=kernel, stride=stride, padding=padding, output_padding=output_padding)
    conv_transpose.weight.data = initialize_weights(OC, IC, kernel)
    conv_transpose.bias.data = bias
    return conv_transpose

def explode_input(input, stride, padding=1, output_padding=0):
    N, C, H, W = input.shape
    exploded_H = (H - 1) * stride + 1 + 2 * padding + output_padding
    exploded_W = (W - 1) * stride + 1 + 2 * padding + output_padding
    input_exploded = torch.zeros(N, C, exploded_H, exploded_W)
    input_exploded[:, :, padding:(exploded_H - padding):stride, padding:(exploded_W - padding):stride] = input
    return input_exploded

def create_conv_2d_simulation(conv_transpose, OC, IC, kernel):
    conv_2d_simulation = nn.Conv2d(OC, IC, kernel_size=kernel, padding=0)
    weights = conv_transpose.weight.detach()
    weights_flipped = torch.flip(weights, [2, 3])
    weights_swapped_channels = weights_flipped.permute(1, 0, 2, 3)
    conv_2d_simulation.weight.data = weights_swapped_channels
    conv_2d_simulation.bias.data = conv_transpose.bias.data
    return conv_2d_simulation

def print_results(name, input, weight, output):
    print(f"{name} input:\n", input)
    print(f"{name} weight:\n", weight)
    print(f"{name} output:\n", output)

def compare_outputs(golden_output, simulated_output):
    print("Golden 输出大小:", golden_output.size())
    print("模拟输出大小:", simulated_output.size())
    golden_output_np = golden_output.detach().numpy()
    simulated_output_padded_np = simulated_output.detach().numpy()
    indices = np.where(golden_output_np != simulated_output_padded_np)
    if indices[0].size > 0:
        coord = tuple(index[0] for index in indices)
        print(f"Coordinate: {coord}")
        print(f"Golden output: {golden_output_np[coord]}")
        print(f"Simulated output: {simulated_output_padded_np[coord]}")
        print("Output is not equal.")
    else:
        print("=========== ConvTranspose2d and conv2d_simulate all elements are equal. ===========")

input_tensor = create_tensor(total_size)
conv_transpose = create_conv_transpose(IC, OC, kernel, stride, padding, output_padding)
golden_output = conv_transpose(input_tensor)
input_padded = explode_input(input_tensor, stride, padding_conv2d, output_padding)
conv_2d_simulation = create_conv_2d_simulation(conv_transpose, OC, IC, kernel)
simulated_output = conv_2d_simulation(input_padded)

print_results("conv_transpose", input_tensor, conv_transpose.weight.data, golden_output)
print_results("conv_2d_simulation", input_padded, conv_2d_simulation.weight.data, simulated_output)
compare_outputs(golden_output, simulated_output)
```



#### C++脚本


## Others
