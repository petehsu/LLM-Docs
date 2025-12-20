// ============ 下载功能 ============

// 下载单个文件
function downloadFile(content, filename) {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// 复制文档内容
async function copyDocContent() {
    if (!currentDocContent) return;
    try {
        await navigator.clipboard.writeText(currentDocContent);
        showToast(t('copied'));
    } catch (err) {
        console.error('Copy failed:', err);
        showToast(t('downloadFailed'));
    }
}

// 下载当前文档
function downloadCurrentDoc(docPath) {
    if (!currentDocContent || !currentDocPath) return;
    const filename = currentDocPath.split('/').pop() || 'document.md';
    downloadFile(currentDocContent, filename);
    
    // 记录下载统计
    if (docPath && typeof trackDownload === 'function') {
        trackDownload(docPath);
        // 更新 UI
        const downloadsEl = document.getElementById('stat-downloads');
        if (downloadsEl) {
            const current = parseInt(downloadsEl.textContent) || 0;
            downloadsEl.textContent = formatStatNumber(current + 1);
        }
    }
}

// 更新下载按钮状态
function setDownloadBtnLoading(btn, loading) {
    if (loading) {
        btn.dataset.originalText = btn.innerHTML;
        btn.innerHTML = `<span class="spinner"></span> ${t('packaging')}`;
        btn.disabled = true;
    } else {
        btn.innerHTML = btn.dataset.originalText || btn.innerHTML;
        btn.disabled = false;
    }
}

// 打包下载厂商所有文档
async function downloadVendorDocs(vendorId, btn) {
    const vendor = VENDORS.find(v => v.id === vendorId);
    if (!vendor) return;
    
    const vendorDocs = docsIndex[vendorId];
    if (!vendorDocs || !vendorDocs.languages) {
        showToast(t('downloadFailed'));
        return;
    }
    
    if (btn) setDownloadBtnLoading(btn, true);
    showToast(t('downloading'));
    
    try {
        const zip = new JSZip();
        let count = 0;
        
        for (const [langCode, docs] of Object.entries(vendorDocs.languages)) {
            const langConfig = vendor.languages.find(l => l.code === langCode);
            
            for (const doc of docs) {
                let filePath;
                if (langConfig?.folder) {
                    filePath = `docs/${vendor.folder}/${langConfig.folder}/${doc.path}`;
                } else {
                    filePath = `docs/${vendor.folder}/${doc.path}`;
                }
                
                try {
                    const response = await fetch(filePath);
                    if (response.ok) {
                        const content = await response.text();
                        const zipPath = `${vendor.name}/${langCode}/${doc.path}`;
                        zip.file(zipPath, content);
                        count++;
                    }
                } catch (e) {
                    console.log('Failed to fetch:', filePath);
                }
            }
        }
        
        const blob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${vendor.name}-docs.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast(`${t('downloadComplete')} (${count} files)`);
    } catch (err) {
        console.error('Download failed:', err);
        showToast(t('downloadFailed'));
    } finally {
        if (btn) setDownloadBtnLoading(btn, false);
    }
}

// 打包下载文件夹内的文档
async function downloadFolderDocs(vendorId, langCode, folder, btn) {
    const vendor = VENDORS.find(v => v.id === vendorId);
    if (!vendor) return;
    
    const vendorDocs = docsIndex[vendorId];
    const langDocs = vendorDocs?.languages?.[langCode] || [];
    const folderDocs = langDocs.filter(d => (d.folder || t('rootFolder')) === folder);
    
    if (folderDocs.length === 0) {
        showToast(t('downloadFailed'));
        return;
    }
    
    if (btn) setDownloadBtnLoading(btn, true);
    showToast(t('downloading'));
    
    try {
        const zip = new JSZip();
        const langConfig = vendor.languages.find(l => l.code === langCode);
        let count = 0;
        
        for (const doc of folderDocs) {
            let filePath;
            if (langConfig?.folder) {
                filePath = `docs/${vendor.folder}/${langConfig.folder}/${doc.path}`;
            } else {
                filePath = `docs/${vendor.folder}/${doc.path}`;
            }
            
            try {
                const response = await fetch(filePath);
                if (response.ok) {
                    const content = await response.text();
                    zip.file(doc.path, content);
                    count++;
                }
            } catch (e) {
                console.log('Failed to fetch:', filePath);
            }
        }
        
        const blob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const safeFolderName = folder.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_');
        a.download = `${vendor.name}-${safeFolderName}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast(`${t('downloadComplete')} (${count} files)`);
    } catch (err) {
        console.error('Download failed:', err);
        showToast(t('downloadFailed'));
    } finally {
        if (btn) setDownloadBtnLoading(btn, false);
    }
}

// 打包下载所有文档
async function downloadAllDocs(btn) {
    if (btn) setDownloadBtnLoading(btn, true);
    showToast(t('downloading'));
    
    try {
        const zip = new JSZip();
        let count = 0;
        
        for (const vendor of VENDORS) {
            const vendorDocs = docsIndex[vendor.id];
            if (!vendorDocs || !vendorDocs.languages) continue;
            
            for (const [langCode, docs] of Object.entries(vendorDocs.languages)) {
                const langConfig = vendor.languages.find(l => l.code === langCode);
                
                for (const doc of docs) {
                    let filePath;
                    if (langConfig?.folder) {
                        filePath = `docs/${vendor.folder}/${langConfig.folder}/${doc.path}`;
                    } else {
                        filePath = `docs/${vendor.folder}/${doc.path}`;
                    }
                    
                    try {
                        const response = await fetch(filePath);
                        if (response.ok) {
                            const content = await response.text();
                            const zipPath = `${vendor.name}/${langCode}/${doc.path}`;
                            zip.file(zipPath, content);
                            count++;
                        }
                    } catch (e) {
                        console.log('Failed to fetch:', filePath);
                    }
                }
            }
        }
        
        const blob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'LLM-API-Docs-All.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast(`${t('downloadComplete')} (${count} files)`);
    } catch (err) {
        console.error('Download failed:', err);
        showToast(t('downloadFailed'));
    } finally {
        if (btn) setDownloadBtnLoading(btn, false);
    }
}
