---
title: Rotate
data: 2024.04.23 18:00
cover: rs_0001.png
categories:
- [Job, 算子开发]
tags:
- Rotate
- Resize
---

# Resize
## Research
> - pytorch文档: [resize](https://pytorch.org/docs/stable/generated/torch.nn.functional.interpolate.html#torch.nn.functional.interpolate)


### resize parameter


```python
torch.nn.functional.interpolate(input, size=None, scale_factor=None, mode='nearest', align_corners=None, recompute_scale_factor=None, antialias=False)
```

- resize参数
  - input (Tensor) – the input tensor
  - size (int or Tuple[int] or Tuple[int, int] or Tuple[int, int, int]) – output spatial size
  - scale_factor (float or Tuple[float]) – multiplier for spatial size. If scale_factor is a tuple, its length has to match the number of spatial dimensions; input.dim() - 2.
  - mode (str) – algorithm used for upsampling: 'nearest' | 'linear' | 'bilinear' | 'bicubic' | 'trilinear' | 'area' | 'nearest-exact'. Default: 'nearest'
  - align_corners (bool, optional) – Geometrically, we consider the pixels of the input and output as squares rather than points. If set to True, the input and output tensors are aligned by the center points of their corner pixels, preserving the values at the corner pixels. If set to False, the input and output tensors are aligned by the corner points of their corner pixels, and the interpolation uses edge value padding for out-of-boundary values, making this operation independent of input size when scale_factor is kept the same. This only has an effect when mode is 'linear', 'bilinear', 'bicubic' or 'trilinear'. Default: False
  - recompute_scale_factor (bool, optional) – recompute the scale_factor for use in the interpolation calculation. If recompute_scale_factor is True, then scale_factor must be passed in and scale_factor is used to compute the output size. The computed output size will be used to infer new scales for the interpolation. Note that when scale_factor is floating-point, it may differ from the recomputed scale_factor due to rounding and precision issues. If recompute_scale_factor is False, then size or scale_factor will be used directly for interpolation. Default: None.
  - antialias (bool, optional) – flag to apply anti-aliasing. Default: False. Using anti-alias option together with align_corners=False, interpolation result would match Pillow result for downsampling operation. Supported modes: 'bilinear', 'bicubic'.

### pytorch源码
#### bilinear mode
- file path：/Users/dugen/work/pytorch-main/aten/src/ATen/native/UpSample.h

```python
template <typename scalar_t>
static inline scalar_t area_pixel_compute_source_index(
    scalar_t scale,
    int64_t dst_index,
    bool align_corners,
    bool cubic) {
  if (align_corners) {
    return scale * dst_index;
  } else {
    scalar_t src_idx = scale * (dst_index + static_cast<scalar_t>(0.5)) -
        static_cast<scalar_t>(0.5);
    // [Note] Follow Opencv resize logic:
    // We allow negative src_idx here and later will use
    //   dx = src_idx - floorf(src_idx)
    // to compute the "distance"(which affects weights).
    // For linear modes, weight distribution doesn't matter
    // for negative indices as they use 2 pixels to interpolate.
    // For example, [-1, 0], they both use pixel 0 value so it
    // doesn't affect if we bound the src_idx to 0 or not.
    // TODO: Our current linear mode impls use unbound indices
    // where we should and then remove this cubic flag.
    // This matters in cubic mode, as we might need [-1, 0, 1, 2]
    // to interpolate and the weights can be affected.
    return (!cubic && src_idx < static_cast<scalar_t>(0)) ? scalar_t(0)
                                                          : src_idx;
  }
}
```

#### nearest mode
- file path：/Users/dugen/work/pytorch-main/aten/src/ATen/native/UpSample.h

```python
static inline int64_t nearest_neighbor_compute_source_index(
    const float scale,
    int64_t dst_index,
    int64_t input_size) {
  // Index computation matching OpenCV INTER_NEAREST
  // which is buggy and kept for BC
  const int64_t src_index =
      std::min(static_cast<int64_t>(floorf(dst_index * scale)), input_size - 1);
  return src_index;
}
```

## Implement
### resize行为
#### 公式推导
- Nearest mode
  - src\_h = dst\_h * (src\_H / dst\_H)
  - src\_w = dst\_w * (src\_W / dst\_W)
  - p\_(dst\_h, dst\_w) = p\_(src\_h, src\_w)
- Bilinear mode
  - align_corners = true
    - output2input addr
      - src\_h = (src\_H-1) / (dst\_H-1) * dst\_h
      - src\_w = (src\_W-1) / (dst\_W-1) * dst\_w
    - fx/fy ===> sample_addr + weight
      - ceil(src\_h) != src\_h ？w_ud = ceil(src\_h) - src\_h : 1; i_ud = floor(src\_h)
      - ceil(src\_w) != src\_w ？w_lr = ceil(src\_w) - src\_w : 1; i_lr = floor(src\_w)
    - 计算output(dst_h, dst_w)值
      - i\_00 = p\_(i_ud, i_lr)、i\_01 = p\_(i_ud, i_lr + 1)、i\_10 = p\_(i_ud + 1, i_lr)、i\_11 = p\_(i_ud + 1, i_lr + 1)
      - w\_00 = w_ud * w_lr、w\_01 = w_ud * (1 - w_lr)、w\_10 = (1 - w_ud) * w_lr、w\_11 = (1 - w_ud) * (1 - w_lr)
      - p(dst\_h, dst\_w)=i\_00 * w\_00 + i\_01 * w\_01 + i\_10 * w\_10 + i\_11 * w\_11
  - align_corners = false
    - output2input addr
      - src\_h = (dst\_h + 0.5) * factor\_h - 0.5, factor\_h = src\_H / dst\_H
      - src\_w = (dst\_w + 0.5) * factor\_w - 0.5, factor\_w = src\_W / dst\_W
    - fx/fy ===> sample_addr + weight
      - ceil(src\_h) != src\_h ？w_ud = ceil(src\_h) - src\_h : 1; i_ud = floor(src\_h)
      - ceil(src\_w) != src\_w ？w_lr = ceil(src\_w) - src\_w : 1; i_lr = floor(src\_w)
    - 计算output(dst_h, dst_w)值
      - i\_00 = p\_(i_ud, i_lr)、i\_01 = p\_(i_ud, i_lr + 1)、i\_10 = p\_(i_ud + 1, i_lr)、i\_11 = p\_(i_ud + 1, i_lr + 1)
      - w\_00 = w_ud * w_lr、w\_01 = w_ud * (1 - w_lr)、w\_10 = (1 - w_ud) * w_lr、w\_11 = (1 - w_ud) * (1 - w_lr)
      - p(dst\_h, dst\_w)=i\_00 * w\_00 + i\_01 * w\_01 + i\_10 * w\_10 + i\_11 * w\_11

#### resize图示
- Nearest mode
![rs_0002](rs_0002.jpg "resize nearest mode")


- Bilinear mode
![rs_0003](rs_0003.jpg "resize bilinear mode")

- workflow
![rs_0004](rs_0004.jpg "resize workflow")

### 验证
#### Python
##### align_corner = true (bilinear)
```python
import torch.nn.functional as F
import torch
import math

# 更改打印选项
torch.set_printoptions(linewidth=120)
debug = True

N, IC, IH, IW = 1, 1, 3, 3
scale_factor = 4
output_size = (IH * scale_factor, IW * scale_factor)

# 创建输入张量
input = torch.arange(1, N * IC * IH * IW + 1, dtype=torch.float32).reshape(N, IC, IH, IW)

output_pytorch = F.interpolate(input, output_size, mode='bilinear', align_corners= True)
# 这里的(4,4)指的是将后两个维度放缩成4*4的大小
print('原数组尺寸:', input.shape)
print(input)
print('bilinear采样尺寸:', output_pytorch.shape)
print("=========================== interpolate pytorch, align_corners = True ===========================\n", output_pytorch)

def interpolate_tensor(input, output_size):
    # 获取输入和输出的大小
    input_size = input.size()
    batch_size, channels, input_height, input_width = input_size
    output_height, output_width = output_size
    output = torch.zeros(batch_size, channels, output_height, output_width)

    # 计算每个点的值
    for i in range(output_height):
        for j in range(output_width):
            src_h = ((input_height - 1) * i) / (output_height - 1)      # H方向 : 
            src_w = ((input_width - 1) * j) / (output_width - 1)        # W方向 : 

            h_weights = torch.tensor([math.ceil(src_h) - src_h if math.ceil(src_h) != src_h else 1, src_h - math.floor(src_h)])     # 1 - v | v
            w_weights = torch.tensor([math.ceil(src_w) - src_w if math.ceil(src_w) != src_w else 1, src_w - math.floor(src_w)])     # 1 - u | u

            h_indices = torch.tensor([math.floor(src_h), min(math.ceil(src_h), input_height - 1)])        # i | min(i+1, input_height - 1)
            w_indices = torch.tensor([math.floor(src_w), min(math.ceil(src_w), input_width - 1)])         # j | min(j+1, input_width - 1)

            if debug:
                print(f"(idx_out_h, idx_out_w) = ({j}, {i}), (src_h, src_w) = ({src_h}, {src_w})")
                print(f"before boundary processing: h_weight0 = {h_weights[0]}, h_weight1 = {h_weights[1]}, w_weight0 = {w_weights[0]}, w_weight1 = {w_weights[1]}")
                print(f"before boundary processing: h_indices0 = {h_indices[0]}, h_indices1 = {h_indices[1]}, w_indices0 = {w_indices[0]}, w_indices1 = {w_indices[1]}")
                print(f"before boundary processing: w00 = {h_weights[0] * w_weights[0]}, w01 = {h_weights[0] * w_weights[1]}, w10 = {h_weights[1] * w_weights[0]}, w11 = {h_weights[1] * w_weights[1]}")
                print(f"before boundary processing: i00 = ({h_indices[0]}, {w_indices[0]}), i01 = ({h_indices[0]}, {w_indices[1]}), i10 = ({h_indices[1]}, {w_indices[0]}), i11 = ({h_indices[1]}, {w_indices[1]})")
                print(f"before boundary processing: i00 = {input[:, :, h_indices[0], w_indices[0]].item()}, i01 = {input[:, :, h_indices[0], w_indices[1]].item()}, i10 = {input[:, :, h_indices[1], w_indices[0]].item()}, i11 = {input[:, :, h_indices[1], w_indices[1]].item()}\n")

            output[:, :, i, j] = (
                h_weights[0] * w_weights[0] * input[:, :, h_indices[0], w_indices[0]] +
                h_weights[0] * w_weights[1] * input[:, :, h_indices[0], w_indices[1]] +
                h_weights[1] * w_weights[0] * input[:, :, h_indices[1], w_indices[0]] +
                h_weights[1] * w_weights[1] * input[:, :, h_indices[1], w_indices[1]]
            )

    return output

output_manual = interpolate_tensor(input, output_size)
print("\n=========================== interpolate manual ===========================")
print(output_manual)

print("\n=========================== compare interpolate ===========================")
if not torch.allclose(output_pytorch, output_manual, atol=1e-4):
    diff = (torch.abs(output_pytorch - output_manual) > 1e-4).nonzero(as_tuple=True)
    for i in range(diff[0].shape[0]):
        index = tuple(d[i].item() for d in diff)
        print(f"output_pytorch{index} = {output_pytorch[index]}, output_manual{index} = {output_manual[index]}")
else:
    print("两个张量相等")
```

##### align_corner = false (bilinear)
```python
import torch.nn.functional as F
import torch
import math

# 更改打印选项
torch.set_printoptions(linewidth=120)
debug = False

N, IC, IH, IW = 1, 8, 200, 100
scale_factor = 2
output_size = (IH * scale_factor, IW * scale_factor)

# 创建输入张量
input = torch.arange(1, N * IC * IH * IW + 1, dtype=torch.float32).reshape(N, IC, IH, IW)

output_pytorch = F.interpolate(input, output_size, mode='bilinear', align_corners= False)
# 这里的(4,4)指的是将后两个维度放缩成4*4的大小
print('原数组尺寸:', input.shape)
print(input)
print('bilinear采样尺寸:', output_pytorch.shape)
print("=========================== interpolate pytorch, align_corners = True ===========================\n", output_pytorch)

def interpolate_tensor(input, output_size):
    # 获取输入和输出的大小
    input_size = input.size()
    batch_size, channels, input_height, input_width = input_size
    output_height, output_width = output_size
    output = torch.zeros(batch_size, channels, output_height, output_width)

    # 计算每个点的值
    for i in range(output_height):
        for j in range(output_width):
            src_h = (i + 0.5) * (input_height / output_height) - 0.5
            src_w = (j + 0.5) * (input_width / output_width) - 0.5

            h_indices = torch.tensor([int(src_h), min(int(src_h) + 1, input_height - 1)])
            w_indices = torch.tensor([int(src_w), min(int(src_w) + 1, input_width - 1)])

            src_h = min(max(0, src_h), IH - 1)
            src_w = min(max(0, src_w), IW - 1)

            h_weights = torch.tensor([1 - (src_h % 1), src_h % 1])
            w_weights = torch.tensor([1 - (src_w % 1), src_w % 1])

            scale_factor_h = (output_height / input_height) if (output_height >= input_height) else (input_height / output_height)
            scale_factor_w = output_width / input_width if (output_width >= input_width) else (input_width / output_width)
            if debug:
                print(f"(idx_out_h, idx_out_w) = ({i}, {j}), (src_h, src_w) = ({src_h}, {src_w})")
                print(f"before boundary processing: h_weight0 = {h_weights[0]}, h_weight1 = {h_weights[1]}, w_weight0 = {w_weights[0]}, w_weight1 = {w_weights[1]}")
                print(f"before boundary processing: h_indices0 = {h_indices[0]}, h_indices1 = {h_indices[1]}, w_indices0 = {w_indices[0]}, w_indices1 = {w_indices[1]}")

            if debug:
                print(f"before boundary processing: w00 = {h_weights[0] * w_weights[0]}, w01 = {h_weights[0] * w_weights[1]}, w10 = {h_weights[1] * w_weights[0]}, w11 = {h_weights[1] * w_weights[1]}")
            output[:, :, i, j] = (
                h_weights[0] * w_weights[0] * input[:, :, h_indices[0], w_indices[0]] +
                h_weights[0] * w_weights[1] * input[:, :, h_indices[0], w_indices[1]] +
                h_weights[1] * w_weights[0] * input[:, :, h_indices[1], w_indices[0]] +
                h_weights[1] * w_weights[1] * input[:, :, h_indices[1], w_indices[1]]
            )

            if debug:
                print(f"before boundary processing: i00 = ({h_indices[0]}, {w_indices[0]}), i01 = ({h_indices[0]}, {w_indices[1]}), i10 = ({h_indices[1]}, {w_indices[0]}), i11 = ({h_indices[1]}, {w_indices[1]})")
                print(f"before boundary processing: i00 = {input[:, :, h_indices[0], w_indices[0]].item()}, i01 = {input[:, :, h_indices[0], w_indices[1]].item()}, i10 = {input[:, :, h_indices[1], w_indices[0]].item()}, i11 = {input[:, :, h_indices[1], w_indices[1]].item()}\n")

    return output

output_manual = interpolate_tensor(input, output_size)
print("\n=========================== interpolate manual ===========================")
print(output_manual)

print("\n=========================== compare interpolate ===========================")
if not torch.allclose(output_pytorch, output_manual, atol=1e-4):
    diff = (torch.abs(output_pytorch - output_manual) > 1e-4).nonzero(as_tuple=True)
    for i in range(diff[0].shape[0]):
        index = tuple(d[i].item() for d in diff)
        print(f"output_pytorch{index} = {output_pytorch[index]}, output_manual{index} = {output_manual[index]}")
else:
    print("两个张量相等")
```

##### nearest mode
```python
import torch.nn.functional as F
import torch
import numpy as np
import math

# 更改打印选项
torch.set_printoptions(linewidth=120)

#################################################################################################################
N, IH, IW, IC = 1, 200, 100, 8
output_size = (2 * IH, 2 * IW)
input_bin = np.fromfile("/home/dugen/project_dxm/pytorch-main/project_dxm/resize/input.bin", dtype=np.int8)
print("=========================== resize input shape ===========================")
print(input_bin.shape)

# Reshape the input data to NHWC format
resize_input_reshape = input_bin.reshape(N, IH, IW, IC)
print("=========================== resize input reshape ===========================")
print(resize_input_reshape.shape)

# Convert the numpy array to a torch tensor
resize_input_tensor = torch.from_numpy(resize_input_reshape)

# Change the data format from NHWC to NCHW
input = resize_input_tensor.permute(0, 3, 1, 2)

# Convert the input tensor to float type
input = input.float()

print("=========================== input first 4 channels ===========================")
print(input[0, :4])
##################################################################################################################

# # ##################################################################################################################
# input = torch.arange(1, 17, dtype=torch.int8).reshape(1, 1, 4, 4)
# output_size = (6, 10)
# input = input.float()
# # ##################################################################################################################

##################################################################################################################
output_pytorch = F.interpolate(input, output_size, mode='nearest')
print('nearest采样尺寸:', output_pytorch.shape)
print("=========================== interpolate pytorch nearest mode ===========================\n", output_pytorch)

# Define the range for truncation
min_value = -128
max_value = 127

# Round the data
rounded_data = torch.round(output_pytorch)

# Truncate the data to the specified range
clamped_data = torch.clamp(rounded_data, min_value, max_value)

# Convert the data to int8_t type
output_pytorch = clamped_data.to(torch.int8)
##################################################################################################################

# def custom_interpolate(input, output_size):
#     input_size = input.size()
#     batch_size, channels, input_height, input_width = input_size
#     output_height, output_width = output_size
#     output = torch.zeros(batch_size, channels, output_height, output_width)

#     for dst_y in range(output_height):
#         for dst_x in range(output_width):
#             src_y = int(dst_y * (input_height / output_height))
#             src_x = int(dst_x * (input_width / output_width))
#             print("(", "{:.2f}".format(dst_y * (input_height / output_height)), "{:.2f}".format(dst_x * (input_width / output_width)), ")", end = "") 
#             output[:, :, dst_y, dst_x] = input[:, :, src_y, src_x]
#         print("")
#     return output

# output_manual = custom_interpolate(input, output_size)
# print("\n=========================== interpolate manual ===========================")
# print(output_manual)

##################################################################################################################
OH, OW, OC = IH * 2, IW * 2, IC
output_bin = np.fromfile("/home/dugen/project_dxm/pytorch-main/project_dxm/resize/output.bin", dtype=np.int8)
print("=========================== resize output shape ===========================")
print(output_bin.shape)

# Reshape the output data to NHWC format
resize_output_reshape = output_bin.reshape(N, OH, OW, IC)
print("=========================== resize output reshape ===========================")
print(resize_output_reshape.shape)

# Convert the numpy array to a torch tensor
resize_output_tensor = torch.from_numpy(resize_output_reshape)

# Change the data format from NHWC to NCHW
output_manual = resize_output_tensor.permute(0, 3, 1, 2)

print(f"=========================== interpolate manual nearest mode ===========================\n", output_manual)
##################################################################################################################

print("\n=========================== compare interpolate ===========================")
if not torch.allclose(output_pytorch, output_manual, atol=1e-4):
    diff = (torch.abs(output_pytorch - output_manual) > 1e-4).nonzero(as_tuple=True)
    for i in range(diff[0].shape[0]):
        index = tuple(d[i].item() for d in diff)
        print(f"output_pytorch{index} = {output_pytorch[index]}, output_manual{index} = {output_manual[index]}")
else:
    print("两个张量相等")
```

#### C++
##### resize.hpp
```cpp
#pragma once
#include "util.hpp"
#include "cpuOpUtils.hpp"
#include "tool_macro.h"
#include "tool_function.h"
#include <random>
#include <string>
#include <cstdlib>
#include <unistd.h>
#include <sys/stat.h>

#define BILINEAR_MODE
// #define ALIGN_CORNER_TRUE_MODE
#define TILE_PER_CLUSTER 4

using resize_golden_t = std::vector<int8_t>;

class ResizeCpuOp {
public:
    ResizeCpuOp(const uint32_t& total_tile_num_, const uint32_t& slice_num_, const uint32_t& ih_, const uint32_t& iw_, 
                const uint32_t& ic_, const uint32_t& scale_factor);

    resize_golden_t GenGoldenInput();
    resize_golden_t GenGoldenOutput(const resize_golden_t& input);
    const resize_golden_t& GetGoldenInputInorder() const;
    void GenGoldenData();

private:
    std::vector<int> shape_;
    uint32_t total_tile_num_;
    uint32_t slice_num_;
    uint32_t scale_factor_;
    uint32_t ih_;
    uint32_t iw_;
    uint32_t ic_;
    uint32_t oh_;
    uint32_t ow_;
    uint32_t oc_;
    uint32_t total_ic_;

    static constexpr float min_value = -128;
    static constexpr float max_value = 127;
    void float_to_int8(std::vector<float>& input_data, std::vector<int8_t>& output_data);

    resize_golden_t golden_input_int8;  // [NHWC]
    resize_golden_t golden_input_inorder_int8;
    resize_golden_t golden_output_int8;
    resize_golden_t golden_output_inorder_int8;
};
```

##### resize.cpp
```cpp
#include "resize_cpuop.hpp"

#ifdef BILINEAR_MODE
    bool if_bilinear_mode = true;
#else
    bool if_bilinear_mode = false;
#endif

#ifdef ALIGN_CORNER_TRUE_MODE
    bool if_align_corner_true = true;
#else
    bool if_align_corner_true = false;
#endif

constexpr float ResizeCpuOp::min_value;
constexpr float ResizeCpuOp::max_value;

ResizeCpuOp::ResizeCpuOp(const uint32_t& total_tile_num, const uint32_t& slice_num_, const uint32_t& ih_, const uint32_t& iw_, const uint32_t& ic_, 
                         const uint32_t& scale_factor) : total_tile_num_(total_tile_num), 
                         slice_num_(slice_num_), ih_(ih_), iw_(iw_), ic_(ic_), scale_factor_(scale_factor){
    oh_ = ih_ * scale_factor_;
    ow_ = iw_ * scale_factor_;
    oc_ = ic_;
    total_ic_ = ic_ * total_tile_num_;

    golden_input_int8.resize(total_tile_num_ * ih_ * iw_ * ic_);
    golden_output_int8.resize(total_tile_num_ * oh_ * ow_ * oc_);
    golden_input_inorder_int8.resize(total_tile_num_ * ih_ * iw_ * ic_);
    golden_output_inorder_int8.resize(total_tile_num_ * oh_ * ow_ * oc_);
}

resize_golden_t ResizeCpuOp::GenGoldenInput() {
    unsigned seed = 123;
    std::mt19937 gen(seed);

    // 用于生成不一致随机数的设备种子
    // std::random_device rd;
    // std::mt19937 gen(rd());
    std::uniform_int_distribution<int> dis(-128, 127);

    for (int idx_tile = 0; idx_tile < total_tile_num_; idx_tile++) {
        for (int idx_h = 0; idx_h < ih_; ++idx_h) {
            for (int idx_w = 0; idx_w < iw_; ++idx_w) {
                for (int idx_c = 0; idx_c < ic_; ++idx_c) {
                    int8_t val = dis(gen);
                    // int8_t val = 1;
                    int idx_elem = idx_h * iw_ * total_ic_ + idx_w * total_ic_ + idx_tile * ic_ + idx_c;
                    golden_input_int8.at(idx_elem) = val;
                    int idx_elem_inorder = idx_tile * ih_ * iw_ * ic_ + idx_h * iw_ * ic_ + idx_w * ic_ + idx_c;
                    golden_input_inorder_int8.at(idx_elem_inorder) = val;

                    // int idx_elem = idx_h * iw_ * total_ic_ + idx_w * total_ic_ + idx_tile * ic_ + idx_c;
                    // golden_input_int8.at(idx_elem) = idx_tile * ih_ * iw_ * ic_ + idx_c * ih_ * iw_ + idx_h * iw_ + idx_w + 1;
                    // int idx_elem_inorder = idx_tile * ih_ * iw_ * ic_ + idx_h * iw_ * ic_ + idx_w * ic_ + idx_c;
                    // golden_input_inorder_int8.at(idx_elem_inorder) = idx_tile * ih_ * iw_ * ic_ + idx_c * ih_ * iw_ + idx_h * iw_ + idx_w + 1;
                }
            }
        }
    }

    return golden_input_int8;
}

const resize_golden_t& ResizeCpuOp::GetGoldenInputInorder() const { 
    return golden_input_inorder_int8; 
}

inline void mkdir_check(const std::string& dir) {
    if (access(dir.c_str(), 0) == 0) {
        std::string cmd = "rm -rf " + dir;
        system(cmd.c_str());
    }
    mkdir(dir.c_str(), S_IRWXU);
}

void ResizeCpuOp::GenGoldenData() {
    std::string path_prefix = "./resize_bin/";
    mkdir_check(path_prefix);

    // input
    std::string name = path_prefix + "resize_input_bilinear.bin";
    std::ofstream ofs;
    ofs.open(name, std::ios::binary | std::ios::out);
    assert((ih_ * iw_ * ic_ * total_tile_num_) == golden_input_inorder_int8.size());
    ofs.write(reinterpret_cast<char *>(golden_input_inorder_int8.data()), golden_input_inorder_int8.size() * sizeof(int8_t));
    ofs.close();

    // output
    name = path_prefix + "resize_output_bilinear.bin";
    ofs.open(name, std::ios::binary | std::ios::out);
    assert((oh_ * ow_ * oc_ * total_tile_num_) == golden_output_int8.size());
    ofs.write(reinterpret_cast<char *>(golden_output_int8.data()), golden_output_int8.size() * sizeof(int8_t));
    ofs.close();
}

void ResizeCpuOp::float_to_int8(std::vector<float>& input_data, std::vector<int8_t>& output_data) {
    for (int i = 0; i < input_data.size(); ++i) {
        // Round the data
        float rounded_data = std::round(input_data[i]);
        // Truncate the data to the specified range
        rounded_data = std::min(std::max(rounded_data, min_value), max_value);
        // Convert the data to int8_t type
        output_data[i] = static_cast<int8_t>(rounded_data);
    }
}

#ifdef BILINEAR_MODE
// =================================== bilinear mode ===================================
resize_golden_t ResizeCpuOp::GenGoldenOutput(const resize_golden_t& input) {
    float scale_factor_true_h = (oh_ >= ih_) ? (float)(ih_ - 1)/(oh_ - 1) : (float)(oh_ - 1)/(ih_ - 1);   // 确定align_true缩放倍数
    float scale_factor_true_w = (ow_ >= iw_) ? (float)(iw_ - 1)/(ow_ - 1) : (float)(ow_ - 1)/(iw_ - 1);
    float scale_factor_false_h = (oh_ >= ih_) ? (float)ih_/oh_ : (float)oh_/ih_;                          // 确定align_false缩放倍数
    float scale_factor_false_w = (ow_ >= iw_) ? (float)iw_/ow_ : (float)ow_/iw_;
    float src_h = 0;
    float src_w = 0;

    std::vector<float> golden_weight_pytorch(4 * oh_ * ow_);
    std::vector<float> golden_temp_outputs(oh_ * ow_ * oc_ * total_tile_num_);
    std::vector<float> outputs_temp_pytorch(oh_ * ow_ * oc_ * total_tile_num_);
    for (int idx_n = 0; idx_n < total_tile_num_; ++idx_n) {
        for (int idx_oh = 0; idx_oh < oh_; ++idx_oh) {
            for (int idx_ow = 0; idx_ow < ow_; ++idx_ow) {

                if (if_align_corner_true) {
                    src_h = idx_oh * scale_factor_true_h ;      // H方向
                    src_w = idx_ow * scale_factor_true_w;       // W方向
                } else {
                    src_h = (idx_oh + 0.5) * scale_factor_false_h - 0.5;     // H方向
                    src_w = (idx_ow + 0.5) * scale_factor_false_w - 0.5;     // W方向
                }

                float h_weights_up = (ceil(src_h) != src_h) ? ceil(src_h) - src_h : 1;          // 1 - u
                float h_weights_down = 1 - h_weights_up;                                        // u
                float w_weights_left = (ceil(src_w) != src_w) ? ceil(src_w) - src_w : 1;        // 1 - v
                float w_weights_right = 1 - w_weights_left;                                     // v

                int h_indices_up = std::max(static_cast<int>(floor(src_h)), 0);
                int h_indices_down = std::min(static_cast<int>(floor(src_h) + 1), static_cast<int>(ih_ - 1));
                int w_indices_left = std::max(static_cast<int>(floor(src_w)), 0);
                int w_indices_right = std::min(static_cast<int>(floor(src_w) + 1), static_cast<int>(iw_ - 1));

                // weight index
                int idx_weight = idx_oh * ow_ + idx_ow;
                int idx_w00 = idx_weight;
                int idx_w01 = idx_w00 + oh_ * ow_;
                int idx_w10 = idx_w01 + oh_ * ow_;
                int idx_w11 = idx_w10 + oh_ * ow_;

                golden_weight_pytorch[idx_w00] = h_weights_up * w_weights_left;
                golden_weight_pytorch[idx_w01] = h_weights_up * w_weights_right;
                golden_weight_pytorch[idx_w10] = h_weights_down * w_weights_left;
                golden_weight_pytorch[idx_w11] = h_weights_down * w_weights_right;

                // golden_output
                for (int idx_c = 0; idx_c < oc_; ++idx_c) {
                    // input_buffer index
                    int idx_ib_00 = idx_n * oh_ * ow_ * ic_ * 4 + idx_oh * ow_ * ic_ + idx_ow * ic_ + idx_c;
                    int idx_ib_01 = idx_ib_00 + oh_ * ow_ * ic_;
                    int idx_ib_10 = idx_ib_01 + oh_ * ow_ * ic_;
                    int idx_ib_11 = idx_ib_10 + oh_ * ow_ * ic_;

                    // input index
                    int idx_i00 = h_indices_up * iw_ * total_ic_ + w_indices_left * total_ic_ + idx_n * ic_ + idx_c;
                    int idx_i01 = h_indices_up * iw_ * total_ic_ + w_indices_right * total_ic_ + idx_n * ic_ + idx_c;
                    int idx_i10 = h_indices_down * iw_ * total_ic_ + w_indices_left * total_ic_ + idx_n * ic_ + idx_c;
                    int idx_i11 = h_indices_down * iw_ * total_ic_ + w_indices_right * total_ic_ + idx_n * ic_ + idx_c;

                    int idx_elem_inorder = idx_n * oh_ * ow_ * oc_ + idx_oh * ow_ * oc_ + idx_ow * oc_ + idx_c;
                    int idx_elem = idx_oh * ow_ * total_ic_ + idx_ow * total_ic_ + idx_n * oc_ + idx_c;

                    golden_temp_outputs.at(idx_elem_inorder) = golden_weight_pytorch[idx_w00] * input.at(idx_i00) +
                                                               golden_weight_pytorch[idx_w01] * input.at(idx_i01) +
                                                               golden_weight_pytorch[idx_w10] * input.at(idx_i10) +
                                                               golden_weight_pytorch[idx_w11] * input.at(idx_i11);

                    outputs_temp_pytorch.at(idx_elem) = golden_temp_outputs.at(idx_elem_inorder);
                }
            }
        }
    }

    float_to_int8(golden_temp_outputs, golden_output_int8);
    float_to_int8(outputs_temp_pytorch, golden_output_inorder_int8);

    return golden_output_int8;
}
#else
// =================================== nearest mode ===================================
resize_golden_t ResizeCpuOp::GenGoldenOutput(resize_golden_t input) {
    float ratio_h = (float)ih_ / (float)oh_;
    float ratio_w = (float)iw_ / (float)ow_;

    for (int idx_n = 0; idx_n < total_tile_num_; ++idx_n) {
        for (int idx_oh = 0; idx_oh < oh_; ++idx_oh) {
            int idx_ih = floor(idx_oh * ratio_h);
            for (int idx_ow = 0; idx_ow < ow_; ++idx_ow) {
                int idx_iw = floor(idx_ow * ratio_w);

                int idx_elem_inorder = idx_n * oh_ * ow_ * oc_ + idx_oh * ow_ * oc_ + idx_ow * oc_ + idx_c;
                for (int idx_c = 0; idx_c < oc_; ++idx_c) {
                    int idx_src = idx_ih * iw_ * total_ic_ + idx_iw * total_ic_ + idx_n * ic_ + idx_c;
                    golden_output_int8.at(idx_elem_inorder) = input.at(idx_src);
                }
            }
        }
    }

    return golden_output_int8;
}
#endif

```

# Rotate
## Research
> - pytorch文档: [rotate](https://pytorch.org/vision/stable/generated/torchvision.transforms.functional.rotate.html)


### resize parameter


```python
torch.nn.functional.interpolate(input, size=None, scale_factor=None, mode='nearest', align_corners=None, recompute_scale_factor=None, antialias=False)
```

- rotate parameter:
  - img (PIL Image or Tensor) – image to be rotated.
  - angle (number) – rotation angle value in degrees, counter-clockwise.
  - interpolation (InterpolationMode) – Desired interpolation enum defined by torchvision.transforms.InterpolationMode. Default is InterpolationMode.NEAREST. If input is Tensor, only InterpolationMode.NEAREST, InterpolationMode.BILINEAR are supported. The corresponding Pillow integer constants, e.g. PIL.Image.BILINEAR are accepted as well.
  - expand (bool, optional) – Optional expansion flag. If true, expands the output image to make it large enough to hold the entire rotated image. If false or omitted, make the output image the same size as the input image. Note that the expand flag assumes rotation around the center and no translation.
  - center (sequence, optional) – Optional center of rotation. Origin is the upper left corner. Default is the center of the image.
  - fill (sequence or number, optional) –
  - Pixel fill value for the area outside the transformed image. If given a number, the value is used for all bands respectively.

## Implement


### 验证
#### Python
##### HW切分
```python
import torch
import torchvision
import numpy as np
import torchvision.transforms.functional as F
import argparse

# Set constants
N, H, W, C = 1, 400, 200, 256  # Input tensor shape
INTERPOLATION_MODE = torchvision.transforms.InterpolationMode.NEAREST  # Interpolation mode
CENTER = (W/2, H/2)  # Rotation center
ANGLE = -1.0353196091174368
# ANGLE = 180

def parse_args():
    """Parse command-line arguments"""
    parser = argparse.ArgumentParser(description="Rotate a tensor and save input and output.")
    parser.add_argument('-c', '--idx_c', type=int, default=0, help='Channel index to print and save.')
    parser.add_argument('-m', '--data_mode', type=int, default=0, choices=[0, 1], help='Mode to generate data: 0 for random, 1 for sequential.')
    return parser.parse_args()

def generate_data(data_mode):
    """Generate input data"""
    if data_mode =='sequential':
        # Generate data with sequential values in WH direction
        return np.tile(np.arange(H * W, dtype=np.int8).reshape(H, W, 1), (N, 1, 1, C))
    elif data_mode == 'random':
        # Generate random data
        return np.random.randint(-128, 128, size=(N, H, W, C), dtype=np.int8)

def rotate_tensor(tensor, angle):
    """Rotate a tensor using PyTorch's rotate function"""
    tensor_nchw = tensor.permute(0, 3, 1, 2)
    rotated_tensor_nchw = F.rotate(tensor_nchw, angle=angle, interpolation=INTERPOLATION_MODE, center=CENTER)
    return rotated_tensor_nchw.permute(0, 2, 3, 1)

def save_data(data, filename):
    """Save data to a binary file"""
    data.tofile(filename)
    print(f"Data saved to: {filename}")

def main():
    args = parse_args()
    idx_c = args.idx_c
    data_mode = 'random' if args.data_mode == 0 else'sequential'

    # Generate input data
    input_nhwc_np = generate_data(data_mode)

    # Save input data
    save_data(input_nhwc_np, 'input_rotate_nhwc.bin')
    print(f"Input numpy array (NHWC) channel {idx_c}:\n", input_nhwc_np[0, :, :, idx_c])

    # Convert to torch tensor
    input_nhwc_tensor = torch.from_numpy(input_nhwc_np)

    # Rotate tensor
    rotated_tensor_nhwc = rotate_tensor(input_nhwc_tensor, angle=ANGLE)

    # Save output data
    output_nhwc_np = rotated_tensor_nhwc.numpy()
    save_data(output_nhwc_np, 'output_rotate_nhwc.bin')
    print(f"Output numpy array (NHWC) channel {idx_c}:\n", output_nhwc_np[0, :, :, idx_c])

if __name__ == '__main__':
    main()

```

##### IC切分
```python
import os
import sys
import argparse
import torch
import torchvision
import numpy as np
import torchvision.transforms.functional as F
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.metrics import mean_squared_error

# 设置打印选项
np.set_printoptions(linewidth=400)
torch.set_printoptions(linewidth=200)

# 配置参数
ENABLE_FP8_DATA_TYPE = True
ENABLE_OUTPUT_BINARY = True
ENABLE_PRINT = True
ENABLE_NHWC_2_NCHW = True
INTERPOLATE_MODE = "nearest"
N, C, H, W = 32, 8, 400, 200  # tile_num, Channels, Height, Width
center = (W/2, H/2)
DATA_PATH = "/home/dugen/scc_dxm/project_dxm/golden_data/rotate"
dtype = np.uint8 if ENABLE_FP8_DATA_TYPE else np.int8
interpolation_mode = torchvision.transforms.InterpolationMode.NEAREST

# 居中打印
def print_centered(text):
    terminal_size = os.get_terminal_size().columns
    print(text.center(terminal_size))

def parse_args():
    parser = argparse.ArgumentParser(description="Process one or more frames.")
    parser.add_argument('-f', '--frame', nargs='+', dest='frame_ids', required=True, help='Frame ID(s) to process.')
    return parser.parse_args()

# 读取二进制文件
def read_bin_file(file_path, dtype):
    if os.path.exists(file_path):
        return np.fromfile(file_path, dtype=dtype)
    else:
        print_centered("File does not exist:", file_path)
        return None

# 读取角度值
def read_angle_from_bin_file(file_path):
    if not os.path.exists(file_path):
        print_centered("Angle file does not exist:", file_path)
        return 0.0, 0.0
    with open(file_path, 'rb') as file:
        angle_fp64 = np.fromfile(file_path, dtype=np.float32)[0]
        angle_fp32 = float(angle_fp64)
    return angle_fp32, angle_fp64

def transform_and_save(data, original_layout, N, H, W, C, filename_prefix):
    """
    此函数将保存的文件路径修改为脚本所在目录的data_pytorch子目录。
    """
    save_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data_pytorch')
    os.makedirs(save_dir, exist_ok=True)  # 确保目录存在

    if original_layout == 'NCHW':
        tensor = torch.from_numpy(data.reshape(N, C, H, W))
    elif original_layout == 'NHWC':
        tensor = torch.from_numpy(data.reshape(N, H, W, C)).permute(0, 3, 1, 2)
    else:
        raise ValueError("Unsupported original layout. Expected 'NCHW' or 'NHWC'.")

    # 文件保存路径调整
    filename_nchw = os.path.join(save_dir, f"rotate_{INTERPOLATE_MODE}_pytorch_{filename_prefix}_nchw.bin")
    tensor.numpy().tofile(filename_nchw)
    print_centered(f"Saved NCHW layout to {filename_nchw}, shape: {tensor.shape}")

    tensor_nhwc = tensor.permute(0, 2, 3, 1)
    filename_nhwc = os.path.join(save_dir, f"rotate_{INTERPOLATE_MODE}_pytorch_{filename_prefix}_nhwc.bin")
    tensor_nhwc.numpy().tofile(filename_nhwc)
    print_centered(f"Saved NHWC layout to {filename_nhwc}, shape: {tensor_nhwc.shape}")

# Tensor余弦相似度与MSE比较
def tensor_cosine_similarity(tensor_a, tensor_b, thd=0.999):
    tensor_a = tensor_a.numpy().reshape(1, -1)
    tensor_b = tensor_b.numpy().reshape(1, -1)

    try:
        cos_sim = cosine_similarity(tensor_a, tensor_b)[0][0]
        mse = mean_squared_error(tensor_a, tensor_b)
    except Exception as e:
        print_centered(f"Error calculating metrics: {e}")
        sys.exit(1)

    result = 'pass' if cos_sim > thd else 'fail'
    print_centered(f"Cosine similarity: {cos_sim}, Mean square error: {mse}, Test result: {result}")
    
    return True if result == 'pass' else False

def rotate_manual(images_nchw, angle, interpolation_mode, center):
    N, C, H, W = images_nchw.shape
    x_c, y_c = center[0] - 0.5, center[1] - 0.5
    angle_rad = math.radians(angle)

    # 计算 cos 和 sin 的值
    cos_theta = math.cos(angle_rad)
    sin_theta = math.sin(angle_rad)
    x_center = x_c - x_c * cos_theta + y_c * sin_theta
    y_center = y_c - x_c * sin_theta - y_c * cos_theta

    # 创建一个与输入相同形状的张量来存储旋转后的图像
    rotated_images_nchw_optimized = torch.zeros_like(images_nchw)

    # 创建网格
    y_grid, x_grid = torch.meshgrid(torch.arange(H), torch.arange(W), indexing='ij')  
    y_grid = y_grid.float()
    x_grid = x_grid.float()

    # 计算旋转后的位置
    y_i = x_grid * sin_theta + y_grid * cos_theta + y_center
    x_i = x_grid * cos_theta - y_grid * sin_theta + x_center
    a1 = y_i
    b1 = x_i

    # 将新位置的值赋给输出张量的对应位置
    x_ir = torch.round(x_i).long()
    y_ir = torch.round(y_i).long()

    x_i = torch.clamp(x_ir, 0, W-1)
    y_i = torch.clamp(y_ir, 0, H-1)
    mask = (x_ir >= 0) & (x_ir < W) & (y_ir >= 0) & (y_ir < H)

    rotated_images_nchw_optimized[:, :, mask] = images_nchw[:, :, y_i[mask], x_i[mask]]

    if ENABLE_PRINT:
        # 在 c, h, w 维度进行打印
        for c in range(C):
            for h in range(H):
                for w in range(W):
                    if mask[h, w]:
                        print_centered(f"(c, y, x) = ({c}, {h}, {w})\t(y_i, x_i) = ({a1[h, w]}, {b1[h, w]})\t(round_yi, round_xi) = ({y_ir[h, w]}, {x_ir[h, w]})\t(int_yi, int_xi) = ({y_i[h, w]}, {x_i[h, w]})")
                        # print_centered(f"rotated_images_nchw_optimized[{c}, {h}, {w}] = {rotated_images_nchw_optimized[c, h, w]}")
                        # print_centered(f"images_nchw[{c}, {y_i[h, w]}, {x_i[h, w]}] = {images_nchw[c, y_i[h, w], x_i[h, w]]}")
    else:
        print_centered(f"==================== default close rotate debug print func ====================\n")

    return rotated_images_nchw_optimized
##################################### PYTHON_MANUAL_ROTATE_FUNC #####################################

# 主函数
def main():
    args = parse_args()
    frame_ids = args.frame_ids  # 这将是一个帧ID列表

    for frame_id in frame_ids:
        frame = f"frame{frame_id}"
        print_centered(f"Testing {frame}...")

        input_name = f"{DATA_PATH}/{frame}/Input.prev_bev.32x400x200x8.fp8.bin"
        angle_name = f"{DATA_PATH}/{frame}/Input.angle.fp32.bin"
        output_name = f"{DATA_PATH}/{frame}/Golden.prev_bev_out.32x400x200x8.fp8.bin"

        # 读取输入和输出数据
        input_bin = read_bin_file(input_name, dtype)
        output_bin = read_bin_file(output_name, dtype)

        if ENABLE_NHWC_2_NCHW:
            original_layout = 'NHWC'
            input_tensor = torch.from_numpy(input_bin.reshape(N, H, W, C)).permute(0, 3, 1, 2)
            output_tensor = torch.from_numpy(output_bin.reshape(N, H, W, C)).permute(0, 3, 1, 2)
        else:
            original_layout = 'NCHW'
            input_tensor = torch.from_numpy(input_bin.reshape(N, C, H, W))
            output_tensor = torch.from_numpy(output_bin.reshape(N, C, H, W))
        if not ENABLE_OUTPUT_BINARY:
            output_tensor = rotate_manual(input_tensor, angle_fp32, interpolation_mode, center)

        transform_and_save(input_bin, original_layout, N, H, W, C, f'{frame}_input')
        transform_and_save(output_bin, original_layout, N, H, W, C, f'{frame}_output')

        # 读取角度
        angle_fp32, angle_fp64 = read_angle_from_bin_file(angle_name) if os.path.exists(angle_name) else (0.0, 0.0)
        print_centered(f"[{frame}] angle (fp64): {angle_fp64:.9f}")
        print_centered(f"[{frame}] angle (fp32): {angle_fp32:.9f}")
        
        rotated_pytorch_tensor = torchvision.transforms.functional.rotate(
            input_tensor, angle=angle_fp32, interpolation=interpolation_mode, center=center)

        # 比较结果
        comparison_result = tensor_cosine_similarity(rotated_pytorch_tensor, output_tensor)
        print_centered(f"[{frame}] Comparison result: {'Pass' if comparison_result else 'Fail'}\n")

if __name__ == "__main__":
    main()
```


# Others
