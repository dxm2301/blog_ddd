---
title: Tutorial-Linux
data: 2024.04.14 18:00
cover: wp_0002.png
categories:
- [Note, Linux]
tags:
- Linux
- Vim
- GDB
- Git
---

# Vim

> - <a href="https://www.runoob.com/linux/linux-vim.html">vim菜鸟教程</a>

## 键位图
![vim_keyboard](001.png)
## vim常用功能
> - vim操作逻辑：
>   - {operator} + {motion} = action ：一次编辑动作
>   - {count} + {action}：重复count次action操作
> - Command模式：
>   - `:w`：保存文件；


>   - `:q`：退出 Vim 编辑器；
>   - `:wq`：保存文件并退出 Vim 编辑器；
>   - `:q!`：强制退出Vim编辑器，不保存修改；

### 光标移动、复制粘贴、搜索替换
#### 光标移动

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Styled Table</title>
<link rel="stylesheet" href="styles.css">
<style>
    .custom-table {
        width: 100%;
        border-collapse: collapse;
    }
    .custom-table th, .custom-table td {
        padding: 8px;
        text-align: center;
        border-bottom: 1px solid #ddd;
    }
    .custom-table tr:nth-child(even) {
        background-color: #f2f2f2;
    }
    .custom-table tr:hover {
        background-color: #f5f5f5;
    }
    .custom-table thead {
        position: sticky;
        top: 0;
        background-color: #808080;
        color: white;
    }
    .custom-table thead tr:hover {
        background-color: #a9a9a9;
        color: black;
    }
    .custom-table, .custom-table th, .custom-table td {
        border: 1px solid black;
    }
</style>
</head>
<body>
<!-- 你的HTML内容将在这里，比如具体的表格数据 -->
</body>
</html>

<table class="custom-table">
    <thead>
        <tr>
            <th>快捷键</th>
            <th>功能</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>h、j、k、l</td>
            <td>光标向左、下、上、右移动一个字符</td>
        </tr>
        <tr>
            <td>n {motion}/n space/n enter</td>
            <td>motion执行n次/向右移动n字符/向下移动n行</td>
        </tr>
        <tr>
            <td>0</td>
            <td>行首</td>
        </tr>
        <tr>
            <td>$</td>
            <td>行尾</td>
        </tr>
        <tr>
            <td>^</td>
            <td>第一个非空字符</td>
        </tr>
        <tr>
            <td>G</td>
            <td>文档最后一行</td>
        </tr>
        <tr>
            <td>ngg/nG</td>
            <td>移动到文档第n行（默认n = 1）</td>
        </tr>
        <tr>
            <td>+/-</td>
            <td>非空格符的下/上一行</td>
        </tr>
        <tr>
            <td>m{mark}/`{mark}</td>
            <td>当前位置标记为mark/跳转到mark位置</td>
        </tr>
        <tr>
            <td>zt/zz/zb</td>
            <td>将当前行移至窗口顶部/中央/底部</td>
        </tr>
        <tr>
            <td>H/M/L</td>
            <td>光标移动到屏幕第一行/中间行/最后一行</td>
        </tr>
        <tr>
            <td>ctrl + f/ctrl + b</td>
            <td>屏幕向下/上移动一页</td>
        </tr>
        <tr>
            <td>ctrl + d/ctrl + u</td>
            <td>屏幕向下/上移动半页</td>
        </tr>
        <tr>
            <td>v/ctrl + v</td>
            <td>视觉模式/列视觉模式</td>
        </tr>
        <tr>
            <td>v + < / v + ></td>
            <td>首行缩进/取消缩进</td>
        </tr>
    </tbody>
</table>

#### 搜索替换

<table class="custom-table">
    <thead>
        <tr>
            <th>快捷键</th>
            <th>功能</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>/pattern ?pattern</td>
            <td>在文本中向下/上搜索pattern字符</td>
        </tr>
        <tr>
            <td>*</td>
            <td>等价于/pattern</td>
        </tr>
        <tr>
            <td>n/N</td>
            <td>重复前一个搜索操作/反向重复前一个搜索操作</td>
        </tr>
        <tr>
            <td>:n1,n2s/word1/word2/gc</td>
            <td>在n1~n2行之间将word1替换成word2</td>
        </tr>
        <tr>
            <td>:n1,n2s/\<word1\>/word2/gc</td>
            <td>精准匹配字符串word1</td>
        </tr>
        <tr>
            <td>:1,$s/word1/word2/g 或 :%s/word1/word2/g</td>
            <td>替换范围为第一行～最后一行</td>
        </tr>
        <tr>
            <td>* + :%s//pattern2/gc</td>
            <td>使用*快速选中pattern1进行替换</td>
        </tr>
        <tr>
            <td>v + s/^/\/\//（\cc）</td>
            <td>添加行前注释</td>
        </tr>
        <tr>
            <td>v + s/^\/\///（\cu）</td>
            <td>取消行前注释</td>
        </tr>
    </tbody>
</table>

#### 删除复制粘贴

<table class="custom-table">
    <thead>
        <tr>
            <th>快捷键</th>
            <th>功能</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>nx/nX</td>
            <td>向后/前删除n个字符（默认n = 1）</td>
        </tr>
        <tr>
            <td>dd/ndd</td>
            <td>删除当前行/删除光标所在行开始的n行</td>
        </tr>
        <tr>
            <td>dG/d1G</td>
            <td>删除光标所在行到最后一行/第一行</td>
        </tr>
        <tr>
            <td>d$/d0/d^</td>
            <td>删除光标所在位置到该行末尾/行首/第一个非空字符</td>
        </tr>
        <tr>
            <td>di{/da{/di(/da(</td>
            <td>删除{}/()内部/包含{}/()在内的所有内容</td>
        </tr>
        <tr>
            <td>diw/daw</td>
            <td>删除光标所在单词/删除光标所在单词及后面的空格（单词后无空格则删除单词前空格）</td>
        </tr>
        <tr>
            <td>yy/nyy</td>
            <td>复制当前行/复制光标所在行开始的n行</td>
        </tr>
        <tr>
            <td>yG/y1G</td>
            <td>复制光标所在行到最后一行/第一行</td>
        </tr>
        <tr>
            <td>y$/y0/y^</td>
            <td>复制光标所在位置到该行末尾/行首/第一个非空字符</td>
        </tr>
        <tr>
            <td>yi{/ya{/yi(/ya(</td>
            <td>复制{}/()内部/包含{}/()在内的所有内容</td>
        </tr>
        <tr>
            <td>yiw/yaw</td>
            <td>复制光标所在单词/复制光标所在单词及后面的空格（单词后无空格则复制单词前空格）</td>
        </tr>
        <tr>
            <td>p/P</td>
            <td>在光标后/前粘贴（复制整行时在下一行/上一行粘贴）</td>
        </tr>
        <tr>
            <td>cw/ciw/caw/c$/c0/c^</td>
            <td>更改光标位置到单词末尾/整个单词/包含空格的整个单词/行尾/行首/第一个非空字符</td>
        </tr>
        <tr>
            <td>J</td>
            <td>将当前行和下一行合并为1行</td>
        </tr>
        <tr>
            <td>.</td>
            <td>重复前一个动作</td>
        </tr>
        <tr>
            <td>u</td>
            <td>撤销最近的修改</td>
        </tr>
        <tr>
            <td>ctrl + r</td>
            <td>nromal模式：u撤销更改后，ctrl + r重做这些更改<br>insert模式：ctrl + r + "/%/number，插入寄存器内容（当前缓冲区/文件名称/寄存器number）</td>
        </tr>
    </tbody>
</table>

### 编辑模式

<table class="custom-table">
    <thead>
        <tr>
            <th>快捷键</th>
            <th>功能</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>i, I</td>
            <td>当前光标位置输入/当前行第一个非空字符位置输入</td>
        </tr>
        <tr>
            <td>a, A</td>
            <td>当前光标下一个字符位置输入/当前行最后一个字符位置输入</td>
        </tr>
        <tr>
            <td>o, O</td>
            <td>当前行下一行/上一行插入一个新行</td>
        </tr>
        <tr>
            <td>r, R</td>
            <td>替换光标位置字符/一直替换光标所在位置字符</td>
        </tr>
        <tr>
            <td>[Esc]</td>
            <td>退出Insert模式，回到Normal模式</td>
        </tr>
    </tbody>
</table>





## plug-in
- `vim ~/.vimrc`：添加需要更改的设置，每次启动vim自动更新配置

```bash
set number               " 开启行号显示, set nonumber
set hlsearch             " 搜索时高亮显示匹配项
set cursorline           " 高亮显示当前行，set nocursorline
" set relativenumber: 开启相对行数；set norelativenumber: 关闭相对行数

set tabstop=4            " 设置一个 Tab 为 4 个字符宽
set shiftwidth=4         " 设置缩进 4 个字符宽
set expandtab            " 使用空格代替 Tab

call plug#begin('~/.vim/plugged')   " 开始插件配置
Plug 'scrooloose/nerdcommenter'    " 添加插件：方便的注释功能
Plug 'mg979/vim-visual-multi', {'branch': 'master'}  " 添加插件：多光标编辑支持
call plug#end()                    " 结束插件配置

" 设置标签页的正常显示样式
highlight TabLineFill ctermfg=LightGrey ctermbg=DarkGrey  " 设置未激活标签的填充颜色
highlight TabLine ctermfg=White ctermbg=Black             " 设置未激活标签的颜色
highlight TabLineSel ctermfg=Black ctermbg=LightGrey      " 设置激活标签的颜色

" 使当前激活的标签页更加明显
set tabline=%!MyTabLine()     " 设置自定义标签页行显示
function MyTabLine()          " 定义一个函数来自定义标签行
  let s = ''
  for i in range(tabpagenr('$'))   " 遍历所有标签页
    " 添加分界符和页面序号
    let s .= '%' . (i + 1) . 'T'
    " 当前页使用特殊颜色
    let s .= (i + 1 == tabpagenr() ? '%#TabLineSel#' : '%#TabLine#')
    " 设置标签名或显示文件名
    let s .= ' ' . (i + 1) . '. ' . GetTabLabel(i + 1) . ' '
  endfor
  " 添加最后的填充
  let s .= '%#TabLineFill#%T'
  return s 
endfunction

function GetTabLabel(n)      " 定义一个函数获取标签的标签名
  " 返回第n个标签的标签名称或文件名
  let buflist = tabpagebuflist(a:n)  " 获取指定标签页的缓冲区列表
  let winnr = tabpagewinnr(a:n)      " 获取激活的窗口编号
  return bufname(buflist[winnr - 1]) " 返回当前窗口缓冲区的文件名
endfunction
```

### 注释插件
```bash
# 安装 vim-plug 插件（插件管理器）
curl -fLo ~/.vim/autoload/plug.vim --create-dirs \
https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim

# 在～/.vimrc文件中添加以下内容
vim ~/.vimrc
call plug#begin('~/.vim/plugged')
Plug 'scrooloose/nerdcommenter'
call plug#end()

# 重新打开vim，运行以下命令从 GitHub 下载并安装 nerdcommenter 插件
:PlugInstall
```










# 文本处理工具
## grep

> grep [options] pattern [files]

- `options`：
  - `-i`：忽略大小写差异。（ignore）
  - `-v`：反向匹配，仅显示不包含匹配文本的行。（invert match）
  - `-n`：显示匹配行及其行号。（line number）
  - `-r`或`-R`：递归查找，搜索指定目录下的所有文件和子目录。（recursive）
  - `-l`：仅列出包含匹配行的文件名，而不显示匹配的文本。（list file with matches）
  - `-c`：仅显示每个文件中匹配到的行数。（count）
- `pattern`：这是你要搜索的文本或正则表达式。
- `files`：这是一个或多个要搜索的文件。如果省略此参数，grep将从标准输入读取数据。


```bash
grep "\[npu::inst_cluster3::tile\[0\]::sv\]" debug.log > c3t0.log
grep -e "SV_U2U_W" -e "SV_U2U_R" debug.log > 1.txt        # 搜索带有U2U_W和U2U_R的行
grep -o "cluster8::tile\[0\].*" debug.log > 2.txt         # 搜索匹配cluster8::tile0及后续内容的行
grep -o "cluster8::tile\[0\].*SV_U2U_W.*" debug.log > 3.txt
grep "关键字1" 文件名 ｜ grep "关键字2" > 3.txt
grep -o "\[Tile 32.* Update.*" 1.data > 4.txt
grep -e "slice.*axi_w1" -e "slice.*u2u_r" 5.txt | sed 's/axi_w1/u2u_w/g' > sv.log

grep --text "count" | wc -l
```



## awk

> awk [options] 'program' [files]

- `program`：通常由pattern + action组成：
  - 模式匹配（pattern）：选择哪些行需要应用action（默认应用所有行）；
  - 操作{ action }：包括但不限于**打印**、**修改**、**处理**数据（默认为 print）；
- `files`：指定输入文件的名称（省略/- 读取标准输入）；
- 常用命令结构：
  - pattern { action }：当输入行匹配pattern时，执行action；
  - BEGIN { action }：在处理任何输入行之前执行的action。
  - END { action }：在处理完所有输入行之后执行的action。
- 常用选项：
  - -F fs：设置输入字段的分隔符为fs。
  - -v var=value：在程序开始之前，设置一个awk变量var的值为value。

```bash
# 打印文件每一行
awk '{print}' filename

# 打印所有包含“error”的行，/error/是pattern用于筛选文本
awk '/error/ {print $0}' filename

# 模式匹配 + 正则表达式进一步细化筛选条件
awk '/error/ && $1 > 100 {print $0}' filename
# 对特定字段进行pattern匹配
awk '$2 ~ /pattern/ {print $0}' filename

# 条件打印，如果第2个变量字符长度大于4则打印第1、3个变量
awk '$2 > 4 {print $1, $3}' filename
awk 'length($2) > 4 {print $1, $3}' filename
awk '/length($2) > 4/ {print $1, $3}' filename
```

### 示例
#### accuracy_mismatch

- awk命令

```bash
awk '{
    if (match($0, /\(c, y, x\) = \([^)]+\)/)) {
        cxy = substr($0, RSTART, RLENGTH);
    }
    if (match($0, /\(round_yi, round_xi\) = \([^)]+\)/)) {
        ryx = substr($0, RSTART, RLENGTH);
    }
    if (cxy && ryx)
        print cxy, ryx;
}' 1.log > 2.log
```

- src.log

```tex
Testing frame80...
Saved NCHW layout to rotate_nearest_pytorch_frame80_input_nchw.bin, shape: torch.Size([32, 8, 400, 200])
Saved NHWC layout to rotate_nearest_pytorch_frame80_input_nhwc.bin, shape: torch.Size([32, 400, 200, 8])
Saved NCHW layout to rotate_nearest_pytorch_frame80_output_nchw.bin, shape: torch.Size([32, 8, 400, 200])
Saved NHWC layout to rotate_nearest_pytorch_frame80_output_nhwc.bin, shape: torch.Size([32, 400, 200, 8])
[frame80] angle (fp64): 11.595370230811710
[frame80] angle (fp32): 11.595370230811710
(c, y, x) = (0, 0, 77)  (y_i, x_i) = (-0.4509754180908203, 117.55844116210938)  (round_yi, round_xi) = (0, 118) (int_yi, int_xi) = (0, 118)
(c, y, x) = (0, 0, 78)  (y_i, x_i) = (-0.24997615814208984, 118.53804016113281) (round_yi, round_xi) = (0, 119) (int_yi, int_xi) = (0, 119)
(c, y, x) = (0, 0, 79)  (y_i, x_i) = (-0.04897785186767578, 119.51762390136719) (round_yi, round_xi) = (0, 120) (int_yi, int_xi) = (0, 120)
(c, y, x) = (0, 0, 80)  (y_i, x_i) = (0.15202045440673828, 120.49722290039062)  (round_yi, round_xi) = (0, 120) (int_yi, int_xi) = (0, 120)
(c, y, x) = (0, 0, 81)  (y_i, x_i) = (0.35302066802978516, 121.476806640625)    (round_yi, round_xi) = (0, 121) (int_yi, int_xi) = (0, 121)
(c, y, x) = (0, 0, 82)  (y_i, x_i) = (0.5540189743041992, 122.45640563964844)   (round_yi, round_xi) = (1, 122) (int_yi, int_xi) = (1, 122)
(c, y, x) = (0, 0, 83)  (y_i, x_i) = (0.7550172805786133, 123.43598937988281)   (round_yi, round_xi) = (1, 123) (int_yi, int_xi) = (1, 123)
```

- dst.log

```tex
(c, y, x) = (0, 0, 77) (round_yi, round_xi) = (0, 118)
(c, y, x) = (0, 0, 78) (round_yi, round_xi) = (0, 119)
(c, y, x) = (0, 0, 79) (round_yi, round_xi) = (0, 120)
(c, y, x) = (0, 0, 80) (round_yi, round_xi) = (0, 120)
(c, y, x) = (0, 0, 81) (round_yi, round_xi) = (0, 121)
(c, y, x) = (0, 0, 82) (round_yi, round_xi) = (1, 122)
(c, y, x) = (0, 0, 83) (round_yi, round_xi) = (1, 123)
```

#### sv_log

- awk命令

```bash
awk '/Tile 0/ && /Update/ {
    idx = index($0, "[Tile");
    if (idx > 0) {
        print substr($0, idx);
    }
}' 1.txt > 3.log

# 使用grep实现
grep -e "Tile 0" 1.txt | grep "Update" | grep -o "\[Tile.*" > 4.log
```

- src.log

```tex
# New execution started
2024-03-20 17:19:06.198119828 :0 NOTICE[0]: spike_fm_top: init
2024-03-20 17:19:06.198125820 :0 NOTICE[0]: spike_fm_top: init ccpu program 0 hcpu program 0
2024-03-20 17:19:06.198126357 :0 NOTICE[0]: spike_fm_top: init ccpu option 0
2024-03-20 17:19:06.198126755 :0 NOTICE[0]: spike_fm_top: init hcpu option 0
2024-03-20 17:19:06.198127737 :0 NOTICE[0]: spike_fm_top: init ccpu body 
2024-03-20 17:19:06.217334580 :0 NOTICE[0]: spike_fm_top: init hcpu body 
2024-03-20 17:19:06.221835469 :0 NOTICE[0]: spike_fm_top: init finished
2024-03-20 17:19:06.256568272 :0 NOTICE[1]: [HIBDMA 0 channel 0]: Started one instruction.
2024-03-20 17:19:06.258692580 :0 NOTICE[1]: [HIBDMA 0 channel 0]: Finished one instruction.
2024-03-20 17:19:06.316320218 :0 NOTICE[2]: [Tile 0 SVCTRL]: Started one instruction. Instr tag: 0x0
2024-03-20 17:19:06.317258092 :0 NOTICE[2]: [Tile 0 SVCTRL]: Finished one instruction. Instr tag: 0x0
2024-03-20 17:19:06.317264341 :0 NOTICE[2]: [Tile 0]: Update SV_TILE_CTRL = 0
2024-03-20 17:19:06.317266446 :0 NOTICE[2]: [Tile 0]: Update SV_DRB_W = 00
2024-03-20 17:19:06.317268676 :0 NOTICE[2]: [Tile 0]: Update SV_AXI_R0 = 0
2024-03-20 17:19:06.317270666 :0 NOTICE[2]: [Tile 0]: Update SV_AXI_W0 = 0
2024-03-20 17:19:06.317272391 :0 NOTICE[2]: [Tile 0]: Update SV_AXI_R1 = 0
2024-03-20 17:19:06.317273934 :0 NOTICE[2]: [Tile 0]: Update SV_AXI_W1 = 0
2024-03-20 17:19:06.317255146 :0 NOTICE[5]: [Tile 0]: Update SV_CE_R0 = 0
2024-03-20 17:19:06.318227982 :0 NOTICE[5]: [Tile 0]: Update SV_CE_W0 = 0
2024-03-20 17:19:06.318230260 :0 NOTICE[5]: [Tile 0]: Update SV_CE_R1 = 0
2024-03-20 17:19:06.318231995 :0 NOTICE[5]: [Tile 0]: Update SV_CE_W1 = 0
2024-03-20 17:19:06.317267074 :0 NOTICE[6]: [Tile 0]: Update SV_U2U_R = 0
2024-03-20 17:19:06.318271057 :0 NOTICE[6]: [Tile 0]: Update SV_U2U_W = 0
2024-03-20 17:19:06.317256828 :0 NOTICE[3]: [Tile 0]: Update SV_TCC_NLU_W = 0
2024-03-20 17:19:06.318557186 :0 NOTICE[3]: [Tile 0]: Update SV_TCC_ACT_R = 0
2024-03-20 17:19:06.318560228 :0 NOTICE[3]: [Tile 0]: Update SV_TCC_WGT_R = 0
2024-03-20 17:19:06.318562885 :0 NOTICE[3]: [Tile 0]: Update SV_TCC_WSE_R = 0
2024-03-20 17:19:06.318927308 :0 NOTICE[0]: Barrier mask 0000000000000000000000000000000000000000000000000000000000000001: Starting one instruction. Instr tag: 0x0
2024-03-20 17:19:06.317258352 :0 NOTICE[4]: [Tile 0]: Update SV_CVU_R0 = 0
2024-03-20 17:19:06.319172200 :0 NOTICE[4]: [Tile 0]: Update SV_CVU_R1 = 0
2024-03-20 17:19:06.319176623 :0 NOTICE[4]: [Tile 0]: Update SV_CVU_W = 0
2024-03-20 17:19:06.319634699 :0 NOTICE[2]: [Tile 0Barrier: fenck ack.
2024-03-20 17:19:06.319661379 :0 NOTICE[1]: Barrier mask 0000000000000000000000000000000000000000000000000000000000000001: Receive from tile 0
2024-03-20 17:19:06.319687388 :0 NOTICE[1]: [T=16]Barrier mask 0000000000000000000000000000000000000000000000000000000000000001 passed: Finished one instruction. Instr tag: 0x0
2024-03-20 17:19:06.323494662 :0 NOTICE[7]: [HIBDMA 0 channel 0]: Started one instruction.
2024-03-20 17:19:06.325598258 :0 NOTICE[7]: [HIBDMA 0 channel 0]: Update Tile 0 SV_DRB_W++
2024-03-20 17:19:06.325705359 :0 NOTICE[1]: [Tile 0]: Update SV_DRB_W = 1
```

- dst.log

```tex
[Tile 0]: Update SV_TILE_CTRL = 0
[Tile 0]: Update SV_DRB_W = 00
[Tile 0]: Update SV_AXI_R0 = 0
[Tile 0]: Update SV_AXI_W0 = 0
[Tile 0]: Update SV_AXI_R1 = 0
[Tile 0]: Update SV_AXI_W1 = 0
[Tile 0]: Update SV_CE_R0 = 0
[Tile 0]: Update SV_CE_W0 = 0
[Tile 0]: Update SV_CE_R1 = 0
[Tile 0]: Update SV_CE_W1 = 0
[Tile 0]: Update SV_U2U_R = 0
[Tile 0]: Update SV_U2U_W = 0
[Tile 0]: Update SV_TCC_NLU_W = 0
[Tile 0]: Update SV_TCC_ACT_R = 0
[Tile 0]: Update SV_TCC_WGT_R = 0
[Tile 0]: Update SV_TCC_WSE_R = 0
[Tile 0]: Update SV_CVU_R0 = 0
[Tile 0]: Update SV_CVU_R1 = 0
[Tile 0]: Update SV_CVU_W = 0
[Tile 0]: Update SV_DRB_W = 1
```



## sed

## others


# shell script

## 基础语法
```bash
${}：
${} 主要用于变量替换和参数替换。
${var} 表示取变量 var 的值。
${var:-default} 表示如果变量 var 未定义或者为空，则使用默认值 default。
${var:=default} 表示如果变量 var 未定义或者为空，则将其设置为默认值 default。
${#var} 表示返回变量 var 的长度。
${var:start:length} 表示从变量 var 的第 start 个字符开始，截取 length 个字符。
等等。
$()：
$() 是命令替换的语法，用于将命令的输出结果赋值给变量或者直接输出。
$() 中放置的命令会被执行，并且 $() 会将命令的标准输出作为结果返回。
例如，var=$(command) 表示执行 command 命令，并将其输出赋值给变量 var。
```


### dxm_cf.sh

> `./dxm_cf.sh -c MH20_Resize_Conv_16tiles_2slice_int8 -s pm`

```bash
#!/bin/bash
set -euo pipefail

function usage() {
    cat << EOF
    Usage: $0 [options]
    Options:
    -h|--help               This Message.
    -c|--case_name          Case name
    -s|--stage              Stage name (pm, runtime, fm, python)
EOF
}

function options_parse() {
    while [ $# -gt 0 ]; do
        case "$1" in
            -c|--case_name)
              if [[ ! -z $2 ]] && [[ $2 != -* ]];then
                case_name=$2
                shift
              fi
              ;;
            -s|--stage)
              if [[ ! -z $2 ]] && [[ $2 != -* ]];then
                stage=$2
                shift
              fi
              ;;
            -*|-h|--help)
                usage
                exit 0
                ;;
            *)
                print_center "Error: Invalid argument"
                usage
                exit 1
                ;;
        esac
        shift
    done
}

function print_center() {
    local text=$1
    local cols=$(tput cols)
    printf "%*s\n" $(((${#text}+$cols)/2)) "$text"
}

if [ $# -eq 0 ]; then
    usage
    exit 1
fi
options_parse $@
print_center "================ $0 $case_name $stage ================"

# define common file path
workspace_dir=$(pwd)
log_dir="${workspace_dir}/log/${case_name}"
mkdir -p ${log_dir}
pm_log="${log_dir}/${case_name}_pm.log"
runtime_log="${log_dir}/${case_name}_runtime.log"
fm_log="${log_dir}/${case_name}_fm.log"
camera_fusion_instr_data="${workspace_dir}/runtime/test/golden_test/schu_instr_executor/massive_hit/${case_name}/"
camera_fusion_bin="${workspace_dir}/runtime/builddir/massive_hit_${case_name}/massive_hit_${case_name}.bin"
golden_output_bin="${camera_fusion_instr_data}golden_output.bin"
microbench_out_bin="${workspace_dir}/data/microbench_camera_fusion_out.bin"
meson_build_file="${workspace_dir}/dataflow_net/meson.build"
testcase_resize="${workspace_dir}/dataflow_net/op_net/ops/test_ops/resize/testcase_resize.cpp"

function pm_compile() {
    cd "${workspace_dir}/dataflow_net/builddir"
    local slice_num=$(echo "${case_name}" | grep -oP '\d+slice' | grep -oP '\d+')

    if [[ "$slice_num" == "1" ]]; then
        sed -i 's/^\(#define MULTI_SLICE_ENABLE\)/\/\/\1/' "$testcase_resize"
    else
        sed -i 's/^\/\/\(.*#define MULTI_SLICE_ENABLE.*\)/\1/' "$testcase_resize"
    fi

    sed -i -e "s/#define SLICE_NUM .*/#define SLICE_NUM ${slice_num}/" \
           -e "s/#define CASE_NAME .*/#define CASE_NAME \"${case_name}\"/" "$testcase_resize"

    if grep -q "executable ('resize'" "$meson_build_file"; then
        print_center "resize ====> ${case_name}"
        sed -i "s/executable ('resize'/executable ('${case_name}'/g" "$meson_build_file"
    else
        original_pattern=$(awk '{
            if (match($0, /MH20_Resize_Conv_16tiles_[0-9]+slice_int8/)) {
                print substr($0, RSTART, RLENGTH)
            }
        }' "$meson_build_file")

        if [[ -n "$original_pattern" ]]; then
            print_center "${original_pattern} ====> ${case_name}"
            sed -i "s/$original_pattern/${case_name}/g" "$meson_build_file"
        fi
    fi

    print_center "================ $case_name pm compile start ================"
    ninja ${case_name} &> ${pm_log} || { print_center "Compilation failed, exiting..."; exit 1; }
    ./${case_name} >> ${pm_log} 2>&1
    print_center "================ $case_name pm compile end ================"
}

function runtime_compile() {
    if [ ! -d \"${camera_fusion_instr_data}\" ]; then
        mkdir -p ${camera_fusion_instr_data}
    fi
    cp -rf ${workspace_dir}/dataflow_net/builddir/net_dataflow/${case_name}/* ${camera_fusion_instr_data}
    cd ${workspace_dir}/runtime
    print_center "================ ${case_name} runtime compile start ================"
    echo 'include(${GOLDEN_ROOT}/schu_instr_executor/CMakeLists.txt)' > ${workspace_dir}/runtime/test/golden_test/CMakeLists.txt
    ${workspace_dir}/runtime/build.sh fm --cf-case=${case_name} &> ${runtime_log}
    print_center "================ ${case_name} runtime compile end ================"
    cd ${workspace_dir}
}

function fm_execute() {
    print_center "================ ${case_name} fm execute start ================"
    ${workspace_dir}/ebb_model/fm/test/spike_fm_smoke/old_fm_d_smoke_test.bin ${camera_fusion_bin} &> ${fm_log}
    print_center "================ ${case_name} fm execute end ================"
}

function python_check_result() {
    print_center "================ ${case_name} pyton check result start ================"
    python ${workspace_dir}/project_dxm/rotate/cosine_similarity.py ${golden_output_bin} ${microbench_out_bin}
    print_center "================ ${case_name} python check result end ================"
}

declare -A stages=(
    ["pm"]="pm_compile"
    ["runtime"]="runtime_compile"
    ["fm"]="fm_execute"
    ["python"]="python_check_result"
)

execute=false
for key in "pm" "runtime" "fm" "python"; do
    if [[ $stage == $key || $execute == true || -z $stage ]]; then
        execute=true
        eval "${stages[$key]}"
    fi
done
```



### dxm_vdk.sh

> `./dxm_vdk_rotate.sh -c rotate -s 1 -e 10`

#### shell_script

```bash
#!/bin/bash

usage() {
    cat << EOF
    Usage: $0 [options]
    Options:
    -h|--help               Show this message.
    -s|--start              Start frame number to process.
    -e|--end                End frame number to process (if not provided, defaults to start frame).
    -c|--case_name          Case name to process (default is ${case_name}).
EOF
}

print_center() {
    local text=$1
    local cols=$(tput cols)
    printf "%*s\n" $(((${#text}+$cols)/2)) "$text"
}

initialize() {
    set -euo pipefail
    print_center "Initializing script variables and paths..."
    workspace_dir=$(pwd)
    runtime_dir="${workspace_dir}/runtime"
    fm_test_dir="${workspace_dir}/ebb_model/fm/test/spike_fm_smoke"
    sample_data_dir="${workspace_dir}/data"
    python_dir="${workspace_dir}/project_dxm/rotate"
    frame_id=""
    frame_start="-1"
    frame_end="-1"
    print_center "Initialization complete."
}

config() {
    print_center "Configuring paths and names for frame ${frame_id}..."
    case_name="microbench_ipu_rotate_32tiles_fp8_nearest"
    input_original_name="input_200x400x8_fp8_32tile_nearest"
    output_original_name="output_200x400x8_fp8_32tile_nearest"
    input_target_name="rotate_nearest_pytorch_frame${frame_id}_input_nhwc"
    output_target_name="rotate_nearest_pytorch_frame${frame_id}_output_nhwc"

    golden_test="${workspace_dir}/runtime/test/golden_test"
    target_cmakelists="${golden_test}/CMakeLists.txt"
    golden_test_dir="${golden_test}/${case_name}/data"
    cmake_file_path="${golden_test}/${case_name}/CMakeLists.txt"
    rotate_h_path="${golden_test}/${case_name}/include/rotate.h"
    angle_bin_path="${workspace_dir}/project_dxm/golden_data/rotate/frame${frame_id}/Input.angle.fp32.bin"
    print_center "Configuration for frame ${frame_id} done."
}

parse_options() {
    print_center "Parsing command line options..."

    while [ $# -gt 0 ]; do
        case "$1" in
            -s|--start)
                if [[ ! -z $2 ]] && [[ $2 != -* ]];then
                    frame_start=$2
                    shift
                else
                    print_center "Error: Missing start frame number"
                    exit 1
                fi
                ;;
            -e|--end)
                if [[ ! -z $2 ]] && [[ $2 != -* ]];then
                    frame_end=$2
                    shift
                else
                    print_center "Error: Missing end frame number"
                    exit 1
                fi
                ;;
            -c|--case_name)
                if [[ ! -z $2 ]] && [[ $2 != -* ]];then
                    case_name=$2
                    shift
                else
                    print_center "Error: Missing case name"
                    exit 1
                fi
                ;;
            -*|-h|--help)
                usage
                exit 0
                ;;
            *)
                print_center "Error: Invalid argument"
                usage
                exit 1
                ;;
        esac
        shift
    done

    if [[ $frame_start -ne -1 ]] && [[ $frame_end -eq -1 ]]; then
        frame_end=$frame_start
    fi

    print_center "Command line options parsed successfully. Start Frame: ${frame_start}, End Frame: ${frame_end}"
}

run_python_script_and_process_files() {
    print_center "Running Python script for frame ID: ${frame_id}..."
    python_script="${python_dir}/rotate_dxm.py"
    python_command="python ${python_script} -f ${frame_id}"
    if ${python_command}; then
        print_center "Python script executed successfully."
    else
        print_center "Failed to execute Python script."
        exit 1
    fi

    print_center "Copying generated NHWC bin files to golden test directory..."
    local input_src="${python_dir}/data_pytorch/${input_target_name}.bin"
    local output_src="${python_dir}/data_pytorch/${output_target_name}.bin"
    local input_dst="${golden_test_dir}/${input_target_name}.bin"
    local output_dst="${golden_test_dir}/${output_target_name}.bin"

    local md5_file_src=$(md5sum "${input_src}" | awk '{print $1}')
    local path_file_src=$(md5sum "${input_src}" | awk '{print $2}')
    print_center "MD5 for input src file: ${md5_file_src}"
    print_center "path for input src file: ${path_file_src}"
    cp "${input_src}" "${input_dst}"
    local md5_file_dst=$(md5sum "${input_dst}" | awk '{print $1}')
    local path_file_dst=$(md5sum "${input_dst}" | awk '{print $2}')
    print_center "MD5 for input dst file: ${md5_file_dst}"
    print_center "path for input dst file: ${path_file_dst}"

    md5_file_src=$(md5sum "${output_src}" | awk '{print $1}')
    path_file_src=$(md5sum "${output_src}" | awk '{print $2}')
    print_center "MD5 for output src file: ${md5_file_src}"
    print_center "path for output src file: ${path_file_src}"
    cp "${output_src}" "${output_dst}"
    md5_file_dst=$(md5sum "${output_dst}" | awk '{print $1}')
    path_file_dst=$(md5sum "${output_dst}" | awk '{print $2}')
    print_center "MD5 for output dst file: ${md5_file_dst}"
    print_center "path for output dst file: ${path_file_dst}"
}

update_cmake_and_related_files() {
    echo "include(\${GOLDEN_ROOT}/${case_name}/CMakeLists.txt)" > "$target_cmakelists"

    if grep -q "$input_original_name" "$cmake_file_path"; then
        sed -i "s/$input_original_name/${input_target_name}/g" "$cmake_file_path"
    else
        sed -i "s/rotate_nearest_pytorch_frame[0-9]*_input_nhwc/${input_target_name}/g" "$cmake_file_path"
    fi

    if grep -q "$output_original_name" "$cmake_file_path"; then
        sed -i "s/$output_original_name/${output_target_name}/g" "$cmake_file_path"
    else
        sed -i "s/rotate_nearest_pytorch_frame[0-9]*_output_nhwc/${output_target_name}/g" "$cmake_file_path"
    fi

    angle_value=$(python read_angle.py "${angle_bin_path}")
    sed -i "s/#define ANGLE .*/#define ANGLE (${angle_value})/" "${rotate_h_path}"
}

compile_and_run_tests() {
    local runtime_log="${runtime_dir}/runtime_frame${frame_id}.log"
    local fm_log="${runtime_dir}/fm_frame${frame_id}.log"
    
    print_center "Compiling runtime environment. Logs can be found in ${runtime_log}"
    (cd ${runtime_dir} && ./build.sh fm) > "${runtime_log}" 2>&1
    
    print_center "Executing fm_d_smoke_test. Logs can be found in ${fm_log}"
    (${fm_test_dir}/old_fm_d_smoke_test.bin ${runtime_dir}/builddir/${case_name}/${case_name}.bin) > "${fm_log}" 2>&1
}

calculate_cosine_similarity() {
    local golden_file="${golden_test_dir}/${output_target_name}.bin"
    local sample_file="${sample_data_dir}/${case_name}_out.bin"
    
    local md5_file1=$(md5sum "${golden_file}" | awk '{print $1}')
    local md5_file2=$(md5sum "${sample_file}" | awk '{print $1}')
    
    print_center "MD5 for golden: ${md5_file1}"
    print_center "MD5 for sample: ${md5_file2}"
    
    if [ "${md5_file1}" == "${md5_file2}" ]; then
        print_center "Files are identical, proceeding to calculate cosine similarity."
        
        local cosine_script="${python_dir}/cosine_similarity.py"
        python "${cosine_script}" "${golden_file}" "${sample_file}"
    else
        print_center "Files differ, exiting."
        exit 1
    fi
}

main() {
    initialize
    parse_options "$@"
    if [[ $frame_start -eq -1 ]]; then
        print_center "Error: No frame specified to process."
        exit 1
    fi

    for frame in $(seq $frame_start $frame_end); do
        frame_id=$frame
        print_center "Processing frame ${frame_id}..."

        config
        run_python_script_and_process_files
        update_cmake_and_related_files
        compile_and_run_tests
        calculate_cosine_similarity
    done
}

main "$@"
```





#### python_script

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
        # input_name = f"{DATA_PATH}/{frame}/Input.prev_bev.1x256x400x200.fp8.bin"
        # angle_name = f"{DATA_PATH}/{frame}/Input.angle.fp64.bin"
        # output_name = f"{DATA_PATH}/{frame}/Golden.prev_bev_out.1x256x400x200.fp8.bin"

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

# Git
## github

## gitlab

```bash
git init                           # 初始化git仓库
git clone <repository_url>         # 克隆远程仓库
git checkout -b <branch_name>      # 创建一个新的分支
git add .                          # 添加文件到暂存区
git commit -m "<your_message>"     # 提交更改到本地仓库
git push origin rotate_local:rotate_remote    # 推送该分支到远程仓库并指定名称为rotate_remote
git branch --set-upstream-to=origin/rotate_remote rotate_local    # 绑定local与remote分支
git branch -u origin/rotate_remote rotate_local                   # 简写
git push origin rotate_remote      # 推送更改到远程分支
git pull origin master             # 拉取远程仓库的最新更改
git checkout master
git merge <branch_name>            # 将feature合入master
git branch -d <branch_name>        # 删除分支
git push origin --delete rotate    # 删除origin的远程仓库中的rotate分支

# demo001
git init
git add .
git commit -m "dxm_first_blog"
git remote add origin git@github.com:dxm2301/blog_ddd.git
git remote set-url origin git@github.com:dxm2301/blog_ddd.git
git push -u origin master
```




## girret

# 常用命令
## software install
### apt
```bash
sudo apt install ./package_file.deb	# apt安装deb包
```

### aptitude


### dpkg
```bash
sudo dpkg -i package_file.deb	# dpkg安装deb包
```

## tar
```bash
tar -xzvf dxm.tar.gz
```

- `-x`：解压文件；
- `-z`：待解压文件是用 gzip 压缩；
- `-v`：解压过程中显示文件名；
- `-f`：待解压文件名；

## tree

```bash
tree -L 2 -af path/to/directory
```
- `-L 2`：指定要显示的树的最大深度；
- `-a`：显示所有文件和目录，包括隐藏的文件和目录；
- `-f`：打印每个文件的完整路径前缀；
- `path/to/directory`：显示树结构的目录路径；

## 批量改名

```bash
rename 's/MH20/MH20_1slice/' MH20_Resize_Conv_16tiles_1slice_int8*.log
```


## scp/sftp
```bash
sftp lixiang@10.243.120.94    # 输入密码
# ls查看远程服务器目录，lls查看本地服务器目录
lcd /home/dugen/scc_dxm/directory    # 更改本地目录到要包含复制文件的目录
put file.txt                         # 使用put命令将文件从本地复制到远程服务器
ls                                   # 使用ls确认成功复制到远程服务器
```
