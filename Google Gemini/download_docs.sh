#!/bin/bash

# Google Gemini API 文档批量下载脚本
# 基础 URL 格式: https://ai.google.dev/gemini-api/docs{path}.md.txt?hl=zh-cn

BASE_URL="https://ai.google.dev/gemini-api/docs"
OUTPUT_DIR="./docs"

mkdir -p "$OUTPUT_DIR"

# 文档列表 (路径, 文件名)
declare -a DOCS=(
    "|index"
    "/quickstart|quickstart"
    "/models|models"
    "/models/gemini|models-gemini"
    "/image-generation|image-generation"
    "/long-context|long-context"
    "/structured-output|structured-output"
    "/function-calling|function-calling"
    "/video|video"
    "/live|live-api"
    "/tools|tools"
    "/document-processing|document-processing"
    "/thinking|thinking"
    "/robotics-overview|robotics-overview"
)

echo "开始下载 Google Gemini 文档..."

for doc in "${DOCS[@]}"; do
    IFS='|' read -r path filename <<< "$doc"
    url="${BASE_URL}${path}.md.txt?hl=zh-cn"
    output_file="${OUTPUT_DIR}/${filename}.md"
    
    echo "下载: $filename"
    curl -s "$url" -o "$output_file"
    
    if [ $? -eq 0 ] && [ -s "$output_file" ]; then
        # 清理开头的 <br /> 标签
        sed -i 's/^[[:space:]]*\(<br \/>\|<br\/>\)[[:space:]]*//' "$output_file"
        sed -i '/^$/d; /./,$!d' "$output_file"  # 删除开头空行
        echo "  ✓ 成功: $output_file"
    else
        echo "  ✗ 失败: $url"
    fi
    
    sleep 0.5  # 避免请求过快
done

echo "下载完成！"
