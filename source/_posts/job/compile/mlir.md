---
title: MLIR学习
date: 2024.05.06 22:00:00
cover: wp_0008.jpg
categories:
- [Job, Compile]
tags:
- LLVM
- MLIR
---

# 基本概念
## 参考文献
- [MLIR官网](https://mlir.llvm.org/getting_started/)
- [MLIR: A Compiler Infrastructure for the End of Moore’s Law](https://arxiv.org/pdf/2002.11054)
- [MLIR入门简介1](https://zhuanlan.zhihu.com/p/582635481)
- [MLIR入门简介2](https://zhuanlan.zhihu.com/p/427914063)
## MLIR官方Demo
### 编译安装
```bash
# 克隆仓库
git clone https://gitee.com/mirrors/llvm-project.git

# 编译配置
mkdir llvm-project/build && cd llvm-project/build

cmake -G Ninja ../llvm \
   -DLLVM_ENABLE_PROJECTS=mlir \
   -DLLVM_BUILD_EXAMPLES=ON \
   -DLLVM_TARGETS_TO_BUILD="X86;NVPTX;AMDGPU" \
   -DCMAKE_BUILD_TYPE=Release \
   -DLLVM_ENABLE_ASSERTIONS=ON
   
# 构建项目
cmake --build . --target check-mlir

###################################### SUCCESS ######################################
[2844/2845] Running the MLIR regression tests

Testing Time: 30.50s
  Unsupported: 170
  Passed     : 953
###################################### SUCCESS ######################################
```
- 编译结果
```bash
[4295/4296] Running the MLIR regression tests

Testing Time: 43.43s

Total Discovered Tests: 2774
  Skipped          :    1 (0.04%)
  Unsupported      :  413 (14.89%)
  Passed           : 2359 (85.04%)
  Expectedly Failed:    1 (0.04%)
```

