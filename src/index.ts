import fileUpload from 'express-fileupload'
import { z } from 'zod'
import { 插件 } from '@lsby/net-core'

var 类型描述 = z.object({
  files: z
    .object({
      name: z.string(),
      encoding: z.string(),
      mimetype: z.string(),
      data: z.instanceof(Buffer),
      tempFilePath: z.string(),
      truncated: z.boolean(),
      size: z.number(),
      md5: z.string(),
      mv: z.function(z.tuple([z.string()]), z.promise(z.void())),
    })
    .array(),
  filePayload: z.string().optional(),
})

export class 文件上传插件 extends 插件<typeof 类型描述> {
  constructor(opt: { 文件最大大小: number }) {
    super(类型描述, async (req, res) => {
      await new Promise((resP, _rej) =>
        fileUpload({ limits: { fileSize: opt.文件最大大小 } })(req, res, () => {
          resP(null)
        }),
      )

      let filePayload: string | undefined
      if (req.body && typeof req.body === 'object' && 'filePayload' in req.body) {
        let temp = (req.body as Record<string, unknown>)['filePayload']
        if (typeof temp === 'string') {
          filePayload = temp
        }
      }

      return {
        files: Object.values(req.files as unknown as fileUpload.UploadedFile[]),
        filePayload,
      }
    })
  }
}
