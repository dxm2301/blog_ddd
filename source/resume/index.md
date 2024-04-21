---
title: RESUME
date: 2023-04-16
layout: page
---

<div style="width: 80%; margin: auto; text-align: left;">
  <h1 style="text-align: center;">个人简历</h1>
  <div style="display: flex; align-items: center; padding-top: 10px; padding-bottom: 10px;">
    <img src="/resume/001.jpg" style="width: 160px; height: 160px;">
    <div style="margin-left: 20px;">
      <h1 style="font-size: 24px; margin-top: 5px; margin-bottom: 20px;">姓名：杜根</h1>
      <div style="display: flex; flex-wrap: wrap;">
        <span style="display: inline-block; width: 50%; margin-bottom: 5px;">出生年月：1998.5.7</span>
        <span style="display: inline-block; width: 50%; margin-bottom: 5px;">联系电话：18642856913</span>
        <span style="display: inline-block; width: 50%; margin-bottom: 10px;">地区：杭州市</span>
        <span style="display: inline-block; width: 50%; margin-bottom: 0;">邮箱：1695963186@qq.com</span>
      </div>
    </div>
  </div>
  <div style="margin-top: 20px;">
    <h2>教育背景</h2>
    <div style="margin-left: 20px;">
      <div style="display: flex; flex-wrap: wrap; margin-top: 10px;">
        <span style="display: inline-block; width: 25%; margin-bottom: 5px;">2020.9-2023.4</span>
        <span style="display: inline-block; width: 25%; margin-bottom: 5px;">南京理工大学</span>
        <span style="display: inline-block; width: 25%; margin-bottom: 5px;">机械工程</span>
        <span style="display: inline-block; width: 25%; margin-bottom: 5px;">硕士学位</span>
      </div>
      <div style="display: flex; flex-wrap: wrap; margin-top: 5px;">
        <span style="display: inline-block; width: 25%; margin-bottom: 5px;">2016.9-2020.6</span>
        <span style="display: inline-block; width: 25%; margin-bottom: 5px;">大连交通大学</span>
        <span style="display: inline-block; width: 25%; margin-bottom: 5px;">车辆工程</span>
        <span style="display: inline-block; width: 25%; margin-bottom: 5px;">学士学位</span>
      </div>
    </div>
  </div>
  <div style="margin-top: 20px;">
    <h2>求职意向</h2>
    <div style="margin-left: 20px;">
    <div style="display: flex; flex-wrap: wrap; margin-top: 10px;">
        <span style="display: inline-block; width: 25%; margin-bottom: 5px;">工作性质：全职</span>
        <span style="display: inline-block; width: 25%; margin-bottom: 5px;">目标地点：杭州</span>
        <span style="display: inline-block; width: 50%; margin-bottom: 5px;">求职岗位：算子开发工程师</span>
    </div>
    <div style="display: flex; flex-wrap: wrap; margin-top: 10px;">
        <span style="display: inline-block; width: 25%; margin-bottom: 5px;">到岗时间：月内到岗</span>
        <span style="display: inline-block; width: 25%; margin-bottom: 5px;">目标薪资：面议</span>
    </div>
  </div>
</div>

## 专业技能

- **C++**：熟悉 C++ 语法和标准库，具备设计和实现复杂数据结构和算法的能力。
- **PyTorch**：熟悉 PyTorch 算子的底层实现，具备 convTranspose2d、resize、rotate 等算子在自研 NPU 平台上的移植和优化经验。
- **Linux 系统和命令行工具**：熟练使用 Linux 系统和常用命令行工具进行开发和调试工作，包括 vim、grep、shell script 等。
- **Git**：熟悉 Git Flow 工作流，熟练使用 Git 进行版本控制，能在团队中高效地进行协作开发。
- **GDB**：熟练使用 GDB 调试工具，能进行高效的 debug 和 root cause 定位，快速解决软件问题。

## 工作经验

- **理想汽车有限公司** （2023年4月 - 至今）
  - 职位：算子研发工程师
  - 主要职责：
    - 负责高性能算子的设计、开发和优化，确保其在 NPU 平台上的高效运行。
    - 对算子进行深度性能分析，定位并解决性能瓶颈，有效提升系统运行效率。

## 项目经验

### 项目一：开发和优化 convTranspose2d 算子

- **项目描述**：针对 FPN、UniBEV 等网络中图像上采样需求，在自研 NPU 平台上实现和优化 convTranspose2d 算子。
- 主要职责：
  - **算子开发**：负责在自研 NPU 平台上开发 convTranspose2d 算子，实现图像的上采样功能。
  - **性能优化**：通过拆分权重的方式，将 convTranspose2d 拆分为多个 conv2d 计算。这种优化策略在 2 倍上采样的情况下，成功将激活数据内存消耗降低为 input 膨胀方案的 25%，并提升了近 3 倍的计算性能。

### 项目二：开发和优化 resize、rotate 算子

- **项目描述**：支持 UniBEV、BEVFusion 网络中的图像放缩、旋转功能，实现 bilinear、nearest mode 的 resize、rotate 算子。
- 主要职责：
  - **算子开发**：负责在自研 NPU 上开发 resize、rotate 算子，实现图像的放缩、旋转功能。
  - **性能优化**：通过采用 sync variable、pingpong buffer 构建 pipeline，成功地实现了接近理论性能的 90% 。
  - **精度分析**：分析 IPU 模块在 normalize + denormalize 过程中的精度损失问题，定位并排查 fp24 精度计算不足问题。

## 个人评价

- **学习能力**：热衷于技术挑战，能快速学习并应用新知识。
- **独立工作能力**：能独立完成任务，具备出色的时间管理和项目管理能力。
- **团队协作**：具备良好的团队协作和沟通能力，性格开朗。