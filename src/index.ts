import { SchemaConfigBase } from '@generator/board'
import * as path from 'path'
import lisa from '@listenai/lisa_core'
import {loadPackageJSON} from '@listenai/lisa_core'
import * as compareVersions from 'compare-versions';

class SchemaConfig extends SchemaConfigBase {
    constructor() {
        super();
    }

    showDescIcon() { return false; }

    schema() {
        const packageJSON = path.join(__dirname, '../../../../package.json')
        loadPackageJSON(packageJSON)
        const project_dependencies = lisa.application?.packageJSON?.dependencies || {}
        const isAlgo3 = compareVersions((project_dependencies['@source/csk4002'] || '0.0.0').replace(/[~^]/g,""), '3.5.0') > 0 ? true : false

        return {
          "type": "object",
          "properties": {
            "business": {
              "title": "交互配置",
              "type": "object",
              "properties": {
                "sys_mode": {
                  "title": "协议模式",
                  "description": "离在线方案推荐使用通用双工协议 ",
                  "type": "string",
                  "enum": [
                    "private",
                    "custom",
                    "public"
                  ],
                  "enumNames": [
                    "精简单工发送协议",
                    "自定义双工协议",
                    "通用双工协议"
                  ],
                  "ui:widget": "radio",
                  "default": "private"
                },
                "welcome": {
                  "title": "不显示",
                  "type": "array",
                  "description": "开机提示音数组，随机播放数组中的一条音频",
                  "ui:options": {},
                  "ui:hidden": true
                },
                "play_vol": {
                  "title": "不显示",
                  "type": "number",
                  "ui:widget": "slider",
                  "default": 10,
                  "ui:readonly": false,
                  "ui:hidden": true
                },
                "cae_beam": {
                  "title": "不显示",
                  "type": "number",
                  "enum": [
                    1
                  ],
                  "enumNames": [
                    "1"
                  ],
                  "ui:hidden": true
                },
                "asr": {
                  "title": "识别配置",
                  "type": "object",
                  "properties": {
                    "cmd_send_mode": {
                      "title": "通讯方式",
                      "type": "number",
                      "ui:hidden": "{{formData.business.sys_mode==\"public\"}}",
                      "enum": [
                        1,
                        2,
                        3,
                        0
                      ],
                      "enumNames": [
                        "仅串口通讯",
                        "仅红外通讯",
                        "串口和红外同时通讯",
                        "不需要通讯"
                      ],
                      "default": 1
                    },
                    "asr_mode": {
                      "title": "交互模式",
                      "type": "number",
                      "enum": [
                        3,
                        2
                      ],
                      "enumNames": [
                        "一次唤醒多次识别",
                        "一次唤醒一次识别"
                      ],
                      "default": 3
                    },
                    "timeout": {
                      "title": "超时时间",
                      "type": "number",
                      "description": "单位为秒",
                      "default": 20,
                      "ui:options": {},
                      "ui:hidden": "{{formData.business.asr.asr_mode!=3}}"
                    },
                    "enter_asr": {
                      "title": "不显示",
                      "type": "array",
                      "ui:options": {},
                      "ui:hidden": true
                    },
                    "exit_asr": {
                      "title": "退出识别模式的命令词",
                      "type": "array",
                      "items": {
                        "type": "number"
                      },
                      "ui:options": {},
                      "ui:hidden": true
                    },
                    "loop_mode": {
                      "title": "不显示",
                      "type": "number",
                      "enum": [],
                      "enumNames": [],
                      "ui:widget": "radio",
                      "default": true,
                      "ui:hidden": true
                    }
                  }
                }
              }
            },
            "hw_config": {
              "title": "硬件配置",
              "type": "object",
              "properties": {
                "i2s_out_enable": {
                  "title": "I2S输出开关",
                  "type": "boolean",
                  "ui:widget": "switch",
                  "default": true
                },
                "i2s_out_chs": {
                  "title": "I2S输出音频通道",
                  "description": "最多可选择4路",
                  "type": "array",
                  "items": {
                    "type": "number"
                  },
                  "enum": [
                    0,
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8
                  ],
                  "maxItems": 4,
                  "enumNames": [
                    "静音音频",
                    "MIC1原始音频",
                    "MIC2原始音频",
                    "REF1回采音频",
                    "REF2回采音频",
                    "MIC1降噪后音频",
                    "MIC2降噪后音频",
                    "测试音频",
                    "送云端识别音频"
                  ],
                  "ui:hidden": "{{formData.hw_config.i2s_out_enable!=true}}"
                },
                "usb_mode": {
                  "title": "USB配置",
                  "type": "object",
                  "properties": {
                    "uac_in_enable": {
                      "title": "UAC功能开关",
                      "description": "与USB录音功能互斥",
                      "type": "boolean",
                      "ui:widget": "switch",
                      "ui:hidden": "{{formData.hw_config.usb_mode.custom_enable==true}}"
                    },
                    "uac_in_channel": {
                      "title": "UAC输出音频映射编号",
                      "type": "number",
                      "enum": [
                        1,
                        2,
                        3
                      ],
                      "enumNames": [
                        "1（离线识别）",
                        "2（离线识别）",
                        "3（云端识别）"
                      ],
                      "ui:hidden": isAlgo3 ? '{{false}}' : '{{formData.hw_config.usb_mode.uac_in_enable!=true}}'
                    },
                    "custom_enable": {
                      "title": "USB录音开关",
                      "description": "与UAC功能互斥",
                      "type": "boolean",
                      "ui:widget": "switch",
                      "default": true,
                      "ui:hidden": isAlgo3 ? '{{true}}' : '{{formData.hw_config.usb_mode.uac_in_enable==true'
                    }
                  }
                },
                "mic": {
                  "title": "麦克风配置",
                  "type": "object",
                  "properties": {
                    "type": {
                      "title": "麦克风类型",
                      "type": "string",
                      "enum": [
                        "amic"
                      ],
                      "enumNames": [
                        "模拟麦"
                      ],
                      "ui:widget": "radio",
                      "description": "需要使用数字麦请联系FAE",
                      "default": "amic"
                    },
                    "dist": {
                      "title": "麦间距",
                      "type": "number",
                      "ui:widget": "slider",
                      "description": "单位为mm，不在可选范围内请选择最接近的值",
                      "default": 35,
                      "min": 35,
                      "max": 110
                    }
                  }
                }
              }
            },
            "driver": {
              "title": "驱动配置",
              "type": "object",
              "properties": {
                "uart_ctrl": {
                  "title": "通讯串口配置",
                  "ui:hidden": "{{formData.business.asr.cmd_send_mode!=1&&formData.business.asr.cmd_send_mode!=3}}",
                  "description": "用于上位机通讯",
                  "type": "object",
                  "properties": {
                    "uart": {
                      "title": "通讯串口端口",
                      "type": "number",
                      "enum": [
                        0,
                        1,
                        2
                      ],
                      "enumNames": [
                        "0",
                        "1",
                        "2"
                      ],
                      "default": 2
                    },
                    "baudrate": {
                      "title": "通信串口波特率",
                      "type": "number",
                      "enum": [
                        2400,
                        4800,
                        9600,
                        19200,
                        38400,
                        57600,
                        115200,
                        345600
                      ],
                      "enumNames": [
                        "2400",
                        "4800",
                        "9600",
                        "19200",
                        "38400",
                        "57600",
                        "115200",
                        "345600"
                      ],
                      "default": 115200
                    }
                  }
                },
                "uart_logs": {
                  "title": "日志串口配置",
                  "description": "波特率固定为115200",
                  "type": "object",
                  "properties": {
                    "uart": {
                      "title": "日志串口端口",
                      "type": "number",
                      "enum": [
                        0,
                        1,
                        2
                      ],
                      "enumNames": [
                        "0",
                        "1",
                        "2"
                      ],
                      "default": 1
                    },
                    "baudrate": {
                      "title": "不显示",
                      "type": "number",
                      "enum": [
                        2400,
                        4800,
                        9600,
                        19200,
                        38400,
                        57600,
                        115200,
                        345600
                      ],
                      "enumNames": [
                        "2400",
                        "4800",
                        "9600",
                        "19200",
                        "38400",
                        "57600",
                        "115200",
                        "345600"
                      ],
                      "default": 115200,
                      "ui:hidden": true
                    }
                  }
                },
                "codec": {
                  "title": "声卡配置",
                  "type": "object",
                  "properties": {
                    "i2s": {
                      "title": "不显示",
                      "type": "number",
                      "enum": [
                        0
                      ],
                      "enumNames": [
                        "0"
                      ],
                      "ui:widget": "radio",
                      "ui:hidden": true
                    },
                    "i2c": {
                      "title": "I2C端口",
                      "type": "number",
                      "enum": [
                        0,
                        1
                      ],
                      "enumNames": [
                        "0",
                        "1"
                      ],
                      "ui:widget": "radio"
                    },
                    "adc": {
                      "title": "ADC配置",
                      "type": "object",
                      "properties": {
                        "adc_type": {
                          "title": "ADC型号",
                          "type": "string",
                          "enum": [
                            "es7210",
                            "es7243e"
                          ],
                          "enumNames": [
                            "es7210",
                            "es7243e"
                          ]
                        },
                        "adc_gain": {
                          "title": "ADC增益配置",
                          "type": "array",
                          "description": "0表示关闭增益",
                          "default": [
                            1,
                            2,
                            3,
                            4
                          ],
                          "minItems": 4,
                          "maxItems": 4,
                          "items": [
                            {
                              "type": "number",
                              "title": "MIC1增益",
                              "ui:widget": "slider",
                              "min": 0,
                              "max": 10,
                              "step": 1,
                              "default": 1
                            },
                            {
                              "type": "number",
                              "title": "MIC2增益",
                              "ui:widget": "slider",
                              "min": 0,
                              "max": 10,
                              "default": 1,
                              "step": 1
                            },
                            {
                              "type": "number",
                              "title": "REF1增益",
                              "ui:widget": "slider",
                              "min": 0,
                              "max": 10,
                              "default": 1,
                              "step": 1,
                              "ui:hidden": "{{formData.driver.codec.adc.adc_type==\"es7243e\"}}"
                            },
                            {
                              "type": "number",
                              "title": "REF2增益",
                              "ui:widget": "slider",
                              "min": 0,
                              "max": 10,
                              "default": 1,
                              "step": 1,
                              "ui:hidden": "{{formData.driver.codec.adc.adc_type==\"es7243e\"}}"
                            }
                          ]
                        },
                        "mic_chs": {
                          "title": "麦克风通道配置",
                          "type": "array",
                          "minItems": 2,
                          "maxItems": 2,
                          "default": [
                            1,
                            2
                          ],
                          "items": [
                            {
                              "type": "number",
                              "title": "MIC1通道",
                              "default": 1,
                              "ui:options": {}
                            },
                            {
                              "type": "number",
                              "title": "MIC2通道",
                              "default": 1,
                              "ui:options": {}
                            }
                          ]
                        },
                        "ref_chs": {
                          "title": "参考信号通道配置",
                          "ui:hidden": "{{formData.driver.codec.adc.adc_type==\"es7243e\"}}",
                          "type": "array",
                          "minItems": 2,
                          "maxItems": 2,
                          "default": [
                            1,
                            2
                          ],
                          "items": [
                            {
                              "type": "number",
                              "title": "REF1通道",
                              "default": 1,
                              "ui:options": {}
                            },
                            {
                              "type": "number",
                              "title": "REF2通道",
                              "default": 1,
                              "ui:options": {}
                            }
                          ]
                        }
                      }
                    }
                  }
                },
                "infrared": {
                  "title": "红外配置",
                  "ui:hidden": "{{formData.business.asr.cmd_send_mode!=2&&formData.business.asr.cmd_send_mode!=3}}",
                  "type": "object",
                  "properties": {
                    "pwm": {
                      "title": "PWM 驱动端口",
                      "type": "number",
                      "enum": [
                        0,
                        1
                      ],
                      "enumNames": [
                        "0",
                        "1"
                      ],
                      "ui:widget": "radio",
                      "description": "channel1（pwm=0；ch=1）、channel2（pwm=0；ch=2）、channel3（pwm=0；ch=3）、channel 4（pwm=1；ch=0）、channel5（pwm=1；ch=1）、channel0已被内部占用，配置使用会导致重启问题（pwm=0；ch=0）"
                    },
                    "freq": {
                      "title": "红外发射频率",
                      "type": "number",
                      "description": "单位：Hz",
                      "enum": [
                        36000,
                        38000
                      ],
                      "enumNames": [
                        "36000",
                        "38000"
                      ]
                    },
                    "resend": {
                      "title": "连续发送次数",
                      "type": "number",
                      "ui:options": {}
                    },
                    "ch": {
                      "title": "CH",
                      "description": "channel1（pwm=0；ch=1）、channel2（pwm=0；ch=2）、channel3（pwm=0；ch=3）、channel 4（pwm=1；ch=0）、channel5（pwm=1；ch=1）、channel0已被内部占用，配置使用会导致重启问题（pwm=0；ch=0）",
                      "type": "number",
                      "enum": [
                        0,
                        1,
                        2,
                        3
                      ],
                      "enumNames": [
                        "0",
                        "1",
                        "2",
                        "3"
                      ]
                    },
                    "duty": {
                      "title": "占空比",
                      "min": 1,
                      "max": 255,
                      "type": "number",
                      "description": "支持设置为1-255",
                      "ui:options": {}
                    }
                  }
                }
              }
            },
            "factory": {
              "title": "产测配置",
              "type": "object",
              "properties": {
                "enable": {
                  "title": "使用产测功能",
                  "type": "boolean",
                  "ui:widget": "switch"
                },
                "check_enter_level": {
                  "title": "触发电平",
                  "enum": [
                    true,
                    false
                  ],
                  "enumNames": [
                    "高电平",
                    "低电平"
                  ],
                  "ui:widget": "radio",
                  "default": false,
                  "ui:hidden": "{{formData.factory.enable!=true}}"
                },
                "check_gpios_delay": {
                  "title": "不显示",
                  "type": "number",
                  "default": 2,
                  "ui:options": {},
                  "ui:hidden": true
                }
              }
            }
          }
        };
    }

}

module.exports = new SchemaConfig();