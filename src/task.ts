import lisa from '@listenai/lisa_core'
import * as path from 'path'

export default (core = lisa) => {
  const {job, fs, application, cmd} = core
  job('board:init', {
    title: 'lskit配置准备',
    task: async () => {

      const firmwareConfig = path.join(__dirname, "../templates/application.lini")
      const hardwareConfig = path.join(__dirname, "../templates/hardware.lini")
      const targetFirmwareConfig = path.join(application.context.cskBuild.configPath, 'application.lini')
      const targethardwareConfig = path.join(application.context.cskBuild.configPath, 'hardware.lini')

      if (application.argv && (application.argv as any).hardware) {
        await fs.copy(hardwareConfig, targethardwareConfig)
      } else if (application.argv && (application.argv as any).application) {
        await fs.copy(firmwareConfig, targetFirmwareConfig)
        fs.appendFileSync(targetFirmwareConfig, `\n[ui_schema]\nfrom="@board/lskits-csk4002"`)
      } else {
        await fs.copy(firmwareConfig, targetFirmwareConfig)
        await fs.copy(hardwareConfig, targethardwareConfig)
        fs.appendFileSync(targetFirmwareConfig, `\n[ui_schema]\nfrom="@board/lskits-csk4002"`)
      }
    },
  })
}