const fs = require("fs");
const path = require("path");
const { uploadCanary } = require("@dm/utils");

const host_list = {
    dev: "beditordev.jrdaimao.com",
    dev2: "beditordev2.jrdaimao.com",
    dev3: "beditordev3.jrdaimao.com",
    dev4: "beditordev4.jrdaimao.com",
    sit: "beditorsit.jrdaimao.com",
    uat: "beditoruat.jrdaimao.com",
    gray: "beditorgray.jrdaimao.com",
    production: "beditor.jrdaimao.com",
};

module.exports = async function (outputPath) {
    const htmlPath = `${outputPath}/index.html`;
    const relativePath = path.resolve(htmlPath);
    console.log("文件地址", outputPath);
    if (fs.existsSync(relativePath)) {
        const html = fs.readFileSync(relativePath, "utf-8");
        const env = process.env.SERVE_ENV;
        // 上传金丝雀系统
        console.log("金丝雀发布", host_list[env], env);
        let data;
        try {
            data = await uploadCanary(host_list[env], env, html, env === 'gray' || env === 'production' ? 0 : 1);
        } catch (error) {
            console.log(error);
        }
        if (data) {
            console.info("打包文件开始上传金丝雀系统完成");
        }
    } else {
        console.log("金丝雀上传失败。未发现上传文件");
    }
};
