@board/lskits-csk4002
====

LSkits csk4002核心板 硬件板型模板

* [Usage](#usage)
* [Commands](#commands)

# Usage
在使用[@generator/csk](https://lpm.listenai.com/package/@generator/csk)创建的csk开发项目，会引导选择作为依赖安装。
```sh-session
$ lisa create cskProject --template @generator/csk
```

若你想更换板型，可执行下面命令进行操作

```sh-session
// 1、卸载已有板型模板
$ lisa uninstall @board/xxx
// 2、安装该板型模板
$ lisa install @board/lskits-csk4002
// 3、重新初始化板型配置
$ lisa task board:init
```

默认配置会初始化到csk项目生成器[@generator/csk](https://lpm.listenai.com/package/@generator/csk)的config中定义的configPath路径。

# Tasks
* [`board:init`](#board:init)

## `board:init`

初始化板型配置
```sh-session
$ lisa task board:init
```
重置hardware.lini配置
```sh-session
$ lisa task board:init --hardware
```
重置application.lini配置
```sh-session
$ lisa task board:init --application
```