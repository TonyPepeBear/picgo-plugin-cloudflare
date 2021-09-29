const handle = async ctx => {
    const cfConfig = ctx.getConfig('picBed.cloudflare')
    const imageList = ctx.output
    for (const img of imageList) {
        let image = img.buffer
        if (!image && img.base64Image) {
            image = Buffer.from(img.base64Image, 'base64')
        }
        body = await ctx.request(postOptions(cfConfig.Token, cfConfig.AccountID, image, img.fileName))
        body = JSON.parse(body)

        url = ""
        reg = new RegExp("\/" + cfConfig.Variants + "$")
        for (u of body.result.variants) {
            if (reg.test(u)) {
                url = u
            }
        }
        img.imgUrl = url
    }
    return ctx
}

const postOptions = (token, accountID, image, fileName) => {
    let url = "https://api.cloudflare.com/client/v4/accounts/" + accountID + "/images/v1"
    let headers = {
        "Authorization": "Bearer " + token,
    }
    let formData = {
        'file': {
            'value': image,
            'options': {
                'filename': fileName
            }
        }
    }
    return {
        method: 'POST',
        url: url,
        headers: headers,
        formData: formData
    }
}

module.exports = ctx => {
    const register = () => {
        ctx.helper.uploader.register('cloudflare', {
            handle,
            name: 'Cloudflare Images',
            config: config
        })
    }
    const config = ctx => {
        return [
            {
                name: 'Token',
                type: 'password',
                message: 'xxxxxxxxxxx',
                alias: 'Token'
            },
            {
                name: 'AccountID',
                type: 'input',
                message: 'xxxxxxxxxx',
                alias: 'AccountID'
            },
            {
                name: "Variants",
                type: 'input',
                message: 'public',
                default: 'public',
                alias: 'Variants'
            }
        ]
    }
    return {
        register,
        uploader: 'cloudflare'
    }
}
