const fs = require("fs");
const path = require("path");

// 获取目标文件夹路径（通过命令行参数）
const targetDir = process.argv[2];

if (!targetDir) {
  console.error(
    "请指定要处理的文件夹路径，使用方法：node script.js <文件夹路径>"
  );
  process.exit(1);
}

// 递归处理目录
function processDirectory(directory) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    const fileName = path.basename(filePath);
    // .开头的文件夹或者node_modules文件夹不处理
    if (
      fileName.startsWith(".") ||
      fileName.includes("node_modules") ||
      fileName.indexOf(".lock") !== -1
    ) {
      continue;
    }
    if (stat.isDirectory()) {
      processDirectory(filePath); // 递归处理子目录
    } else if (stat.isFile()) {
      // 只处理js、ts、tsx、jsx、less文件
      if (
        !(
          fileName.endsWith(".js") ||
          fileName.endsWith(".ts") ||
          fileName.endsWith(".tsx") ||
          fileName.endsWith(".jsx") ||
          fileName.endsWith(".css") ||
          fileName.endsWith(".less") ||
          fileName.endsWith(".sass")
        )
      ) {
        continue;
      }
      processFile(filePath); // 处理文件
    }
  }
}

// 处理单个文件
function processFile(filePath) {
  try {
    // 读取文件内容
    let content = fs.readFileSync(filePath, "utf8");

    // 删除空行（包括只包含空白字符的行）
    const newContent = content
      .split(/\r?\n/)
      .filter((line) => line.trim() !== "")
      .join("\n");

    // 只有当内容变化时才写入文件
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, "utf8");
      console.log(`已处理文件：${filePath}`);
    }
  } catch (error) {
    console.error(`处理文件 ${filePath} 时出错：`, error.message);
  }
}

// 启动处理
console.log("开始处理文件夹：", targetDir);
processDirectory(targetDir);
console.log("处理完成！");
