import lisa from '@listenai/lisa_core'
import * as path from 'path'

module.exports = (core = lisa) => {
  const {application} = core

  application.configuration(config => {
    // cskBuild的相关路径配置
    config.addContext('cskBuild', {
      configPath: path.join(application.root, 'config'),
    })
  })
}
