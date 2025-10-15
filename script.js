// 规则数据
const rulesData = {
    replace: {
        titleZh: '替换',
        titleEn: 'Replace',
        descZh: '支持精确替换和模糊替换两种模式。精确替换要求完全匹配才进行替换；模糊替换则不区分大小写，能灵活匹配不同书写形式。可选择替换首个匹配项或全部匹配项，还支持反向功能，将替换内容变回原始内容。提供大小写匹配选项，确保替换结果的大小写与原始文本保持一致。',
        descEn: 'Supports both exact and fuzzy replacement modes. Exact replacement requires complete matching; fuzzy replacement is case-insensitive and can flexibly match different writing forms. You can choose to replace the first match or all matches, and it supports reverse functionality to change replacement content back to original. Provides case matching options to ensure the case of replacement results is consistent with the original text.',
        image: 'pics/rules/replace.png'
    },
    insert: {
        titleZh: '插入',
        titleEn: 'Insert',
        descZh: '在文件名的多种位置插入文本或元数据。不仅支持前缀、后缀和指定位置插入，还可以在特定文本前后插入内容，甚至完全替换当前文件名。支持从右到左计数位置，可使用元数据标签（如音频标题、图像尺寸）作为插入内容，实现智能化命名。',
        descEn: 'Add text or metadata at various positions in filenames. Beyond simple prefix and suffix additions, you can insert content before or after specific text, or even completely replace the current filename. Supports counting positions from right to left and using metadata tags (like audio title or image dimensions) as insertion content for intelligent naming.',
        image: 'pics/rules/insert.png'
    },
    remove: {
        titleZh: '移除',
        titleEn: 'Remove',
        descZh: '从文件名中删除特定的文本内容。支持移除所有匹配、仅第一个匹配或仅最后一个匹配，可选择是否区分大小写、是否全词匹配，还支持通配符模式进行更灵活的文本匹配和移除。',
        descEn: 'Delete specific text content from filenames. Options include removing all matches, only the first match, or only the last match, with toggles for case sensitivity and whole word matching. Also supports wildcard patterns for more flexible text matching and removal.',
        image: 'pics/rules/remove.png'
    },
    serialize: {
        titleZh: '序列化',
        titleEn: 'Serialize',
        descZh: '为文件添加高度可定制的序号。支持多种序列类型：十进制数字、字母、罗马数字、中文数字、自定义序列；灵活的插入选项（前缀、后缀、指定位置或替换整个名称）；强大的计数控制（可设置起始值、重复次数、增量）；智能重置条件（按间隔重置、文件夹变更时重置、文件名变更时重置），特别适合批量整理不同类型或来源的文件。',
        descEn: 'Add highly customizable sequence numbers to files. Supports multiple sequence types: decimal numbers, letters, Roman numerals, Chinese numerals, or custom sequences; flexible insertion options (prefix, suffix, specific position, or replacing the entire name); powerful counting control (configurable start value, repetition count, increment); intelligent reset conditions (reset by interval, folder change, or filename change), especially suitable for batch organizing files of different types or sources.',
        image: 'pics/rules/serialize.png'
    },
    clean: {
        titleZh: '清理',
        titleEn: 'Clean',
        descZh: '智能清理文件名中的常见多余字符和格式问题。可移除不同类型的括号及其内容（圆括号、方括号、花括号）；替换特殊字符为空格（点号、逗号、下划线、加号、减号等）；优化空格（修复多余空格、在大写字母前添加空格）；移除Unicode控制字符或表情符号；还支持忽略数字序列功能，避免清理日期或版本号等数字组合。',
        descEn: 'Intelligently tidy up filenames by removing common redundant characters and formatting issues. Remove different types of brackets and their contents (parentheses, square brackets, curly braces); replace special characters with spaces (periods, commas, underscores, plus signs, minus signs, etc.); optimize spacing (fix extra spaces, add spaces before capital letters); remove Unicode control characters or emoji; with an option to ignore number sequences to avoid cleaning up dates or version numbers.',
        image: 'pics/rules/clean.png'
    },
    strip: {
        titleZh: '清除',
        titleEn: 'Strip',
        descZh: '灵活过滤文件名中特定类型的字符。可选择过滤英文字母、数字、符号、标点符号或自定义字符集。支持在文件名任意位置、仅前缀或仅后缀进行过滤。还可选择是否保留匹配的字符（移除其他字符）、是否区分大小写，特别适合清除文件名中的特定字符模式。',
        descEn: 'Flexibly filter specific character types in filenames. Choose to filter English letters, numbers, symbols, punctuation marks, or custom character sets. Apply filtering throughout the filename, prefix only, or suffix only. Options include keeping matched characters (removing others) and case sensitivity, ideal for cleaning up specific character patterns in filenames.',
        image: 'pics/rules/strip.png'
    },
    case: {
        titleZh: '大小写',
        titleEn: 'Case',
        descZh: '智能转换文件名的大小写格式，支持全部大写、全部小写、首字母大写（每个单词）、仅首单词首字母大写、反转大小写等多种模式。',
        descEn: 'Intelligently convert filename case formats, supporting ALL CAPS, all lowercase, Title Case (Each Word), Sentence case (first word only), and InVeRsE CaSe modes.',
        image: 'pics/rules/case.png'
    },
    extension: {
        titleZh: '扩展名',
        titleEn: 'Extension',
        descZh: '智能管理文件扩展名，解决扩展名混乱问题。可指定新扩展名，选择替换或追加到原文件名；内置"魔术识别"功能，自动检测文件的真实扩展名；支持删除重复扩展名，可选择是否区分大小写，确保文件类型与扩展名的正确匹配。',
        descEn: 'Intelligently manage file extensions to solve extension confusion. Specify new extensions, choose to replace or append to the original filename; includes built-in "Magic Detection" functionality to automatically detect the true file extension; supports removing duplicate extensions with case sensitivity options, ensuring correct matching between file types and extensions.',
        image: 'pics/rules/extension.png'
    },
    padding: {
        titleZh: '填充',
        titleEn: 'Padding',
        descZh: '为文件名添加精确的填充字符。可对数字序列自动添加前导零（如001、002）指定固定位数；可选择是否移除前导零；还支持文本填充功能，使文本达到特定长度（左对齐或右对齐），适合创建整齐、美观且易于排序的文件命名方案。',
        descEn: 'Add precise padding characters to filenames. Automatically add leading zeros to number sequences (like 001, 002) with specified fixed digits; choose whether to remove leading zeros; and utilize text padding functions to reach specific lengths (left or right aligned), perfect for creating neat, aesthetically pleasing, and easily sortable filename schemes.',
        image: 'pics/rules/padding.png'
    },
    delete: {
        titleZh: '删除',
        titleEn: 'Delete',
        descZh: '精确删除文件名的特定部分，支持多种方式：从指定位置删除特定数量的字符、在分隔符之间删除内容、支持从左到右或从右到左删除、可选是否保留分隔符，甚至可以一键清空整个文件名（保留扩展名）。高度灵活的删除功能让您能精确控制要移除的内容。',
        descEn: 'Precisely remove specific parts of filenames through multiple methods: delete a specific number of characters from a designated position, remove content between separators, support deletion from left-to-right or right-to-left, optionally retain separators, or even clear the entire filename with one click (while preserving the extension). This highly flexible deletion feature gives you precise control over what content to remove.',
        image: 'pics/rules/delete.png'
    },
    regular: {
        titleZh: '正则表达式',
        titleEn: 'Regular Expression',
        descZh: '为高级用户准备的强大工具！使用完整的正则表达式语法进行模式匹配和替换，支持捕获组、反向引用等高级功能，实现复杂的文本重构, 同时也支持使用文件元数据作为替换内容。',
        descEn: 'A powerful tool for advanced users! Utilize complete regex syntax for pattern matching and replacement, supporting capture groups, backreferences, and other advanced features to implement complex text restructuring. Also supports using file metadata as replacement content.',
        image: 'pics/rules/regular.png'
    },
    userinput: {
        titleZh: '用户输入',
        titleEn: 'User Input',
        descZh: '实现个性化批量重命名。允许为每个文件单独指定名称，支持手动输入或从文本文件批量导入名称列表, 还可以提取指定文件的名称；灵活的应用方式，可选择完全替换原文件名、添加到原文件名前面或后面；智能处理文件扩展名，可保留原始扩展名或使用新提供的扩展名。',
        descEn: 'Implement personalized batch renaming. Allow separate name specification for each file, supporting manual input or batch import of name lists from text files, plus extraction of names from specified files; flexible application methods, optionally replacing the entire original filename, adding to the beginning or end; intelligent file extension handling, with options to preserve the original extension or use a newly provided one.',
        image: 'pics/rules/userinput.png'
    },
    randomize: {
        titleZh: '随机化',
        titleEn: 'Randomize',
        descZh: '生成随机字符串作为文件名的一部分。提供多种随机字符来源：数字、字母、UUID（标准/紧凑/前缀8位格式）或自定义字符集；支持多种插入位置（前缀、后缀、指定位置或完全替换）；特别设计的"唯一值模式"尽量确保生成的序列不会重复，非常适合需要唯一标识符的场景。',
        descEn: 'Generate random strings as part of filenames. Offers various random character sources: numbers, letters, UUID (standard/compact/8-digit prefix formats), or custom character sets; supports multiple insertion positions (prefix, suffix, specific position, or complete replacement); features a specially designed "unique value mode" to minimize repetition, perfect for scenarios requiring unique identifiers.',
        image: 'pics/rules/randomize.png'
    }
};

// 规则顺序数组
const ruleOrder = ['replace', 'insert', 'remove', 'serialize', 'clean', 'strip', 'case', 'extension', 'padding', 'delete', 'regular', 'userinput', 'randomize'];

// 当前轮播索引和自动播放定时器
let currentIndex = 0;
let autoPlayTimer = null;
const autoPlayInterval = 4000; // 4秒自动切换

// 语言切换
function toggleLanguage() {
    const html = document.documentElement;
    const currentLang = html.classList.contains('lang-zh') ? 'zh' : 'en';
    const newLang = currentLang === 'zh' ? 'en' : 'zh';
    
    html.classList.remove(`lang-${currentLang}`);
    html.classList.add(`lang-${newLang}`);
    
    try {
        localStorage.setItem('preferred-language', newLang);
    } catch (e) {
        console.warn('无法保存语言偏好:', e);
    }
}

// 主题切换
function toggleTheme() {
    const html = document.documentElement;
    const body = document.body;
    const lightIcon = document.querySelector('.light-icon');
    const darkIcon = document.querySelector('.dark-icon');
    
    const currentTheme = html.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    body.setAttribute('data-theme', newTheme);
    
    if (newTheme === 'dark') {
        lightIcon.style.display = 'none';
        darkIcon.style.display = 'block';
    } else {
        lightIcon.style.display = 'block';
        darkIcon.style.display = 'none';
    }
    
    try {
        localStorage.setItem('preferred-theme', newTheme);
    } catch (e) {
        console.warn('无法保存主题偏好:', e);
    }
}

// 轮播图切换 - 3D卡片堆叠效果
function goToSlide(index) {
    const slides = document.querySelectorAll('.carousel-slide');
    const totalSlides = slides.length;
    
    // 循环处理索引
    if (index < 0) {
        currentIndex = totalSlides - 1;
    } else if (index >= totalSlides) {
        currentIndex = 0;
    } else {
        currentIndex = index;
    }
    
    // 计算前一张和后一张的索引
    const prevIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    const nextIndex = (currentIndex + 1) % totalSlides;
    
    // 更新所有卡片的类名
    slides.forEach((slide, index) => {
        slide.classList.remove('active', 'prev', 'next', 'hidden');
        
        if (index === currentIndex) {
            slide.classList.add('active');
        } else if (index === prevIndex) {
            slide.classList.add('prev');
        } else if (index === nextIndex) {
            slide.classList.add('next');
        } else {
            slide.classList.add('hidden');
        }
    });
    
    // 更新指示器
    updateIndicators();
    
    // 更新文字描述
    updateRuleDetails();
}

// 更新指示器
function updateIndicators() {
    const dots = document.querySelectorAll('.indicator-dot');
    dots.forEach((dot, index) => {
        if (index === currentIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// 更新规则详情文字
function updateRuleDetails() {
    const ruleKey = ruleOrder[currentIndex];
    const ruleData = rulesData[ruleKey];
    
    if (!ruleData) return;
    
    const ruleDetails = document.querySelector('.rule-details');
    
    // 添加淡出动画
    ruleDetails.classList.add('content-fade-out');
    
    // 延迟更新内容
    setTimeout(() => {
        document.getElementById('rule-title-zh').textContent = ruleData.titleZh;
        document.getElementById('rule-title-en').textContent = ruleData.titleEn;
        document.getElementById('rule-desc-zh').textContent = ruleData.descZh;
        document.getElementById('rule-desc-en').textContent = ruleData.descEn;
        
        // 移除淡出，添加淡入
        ruleDetails.classList.remove('content-fade-out');
        ruleDetails.classList.add('content-fade-in');
        
        setTimeout(() => {
            ruleDetails.classList.remove('content-fade-in');
        }, 500);
    }, 250);
}

// 上一张
function prevSlide() {
    stopAutoPlay();
    goToSlide(currentIndex - 1);
    startAutoPlay();
}

// 下一张
function nextSlide() {
    stopAutoPlay();
    goToSlide(currentIndex + 1);
    startAutoPlay();
}

// 开始自动播放（向左滚动，新图从左边进入）
function startAutoPlay() {
    stopAutoPlay(); // 先清除旧的定时器
    autoPlayTimer = setInterval(() => {
        goToSlide(currentIndex - 1);
    }, autoPlayInterval);
}

// 停止自动播放
function stopAutoPlay() {
    if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
    }
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
    const html = document.documentElement;
    const body = document.body;
    const lightIcon = document.querySelector('.light-icon');
    const darkIcon = document.querySelector('.dark-icon');
    
    // 应用保存的语言偏好
    try {
        const savedLang = localStorage.getItem('preferred-language');
        const validLang = savedLang === 'en' || savedLang === 'zh' ? savedLang : 'en';
        
        html.classList.remove('lang-zh', 'lang-en');
        html.classList.add(`lang-${validLang}`);
    } catch (e) {
        console.warn('无法读取语言偏好:', e);
        html.classList.add('lang-en');
    }
    
    // 应用保存的主题偏好
    try {
        const savedTheme = localStorage.getItem('preferred-theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
        
        html.setAttribute('data-theme', theme);
        body.setAttribute('data-theme', theme);
        
        if (theme === 'dark') {
            lightIcon.style.display = 'none';
            darkIcon.style.display = 'block';
        } else {
            lightIcon.style.display = 'block';
            darkIcon.style.display = 'none';
        }
    } catch (e) {
        console.warn('无法读取主题偏好:', e);
    }
    
    // 初始化轮播指示器
    const indicatorsContainer = document.querySelector('.carousel-indicators');
    if (indicatorsContainer) {
        ruleOrder.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'indicator-dot';
            if (index === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => {
                stopAutoPlay();
                goToSlide(index);
                startAutoPlay();
            });
            indicatorsContainer.appendChild(dot);
        });
    }
    
    // 初始化箭头按钮（交换绑定）
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', nextSlide);  // 左箭头：内容向左移
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', prevSlide);  // 右箭头：内容向右移
    }
    
    // 鼠标悬停时暂停自动播放
    const carouselWrapper = document.querySelector('.carousel-wrapper');
    if (carouselWrapper) {
        carouselWrapper.addEventListener('mouseenter', stopAutoPlay);
        carouselWrapper.addEventListener('mouseleave', startAutoPlay);
    }
    
    // 键盘导航
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
    
    // 开始自动播放
    startAutoPlay();
    
    // 初始化第一张卡片和文字
    goToSlide(0);
    
    console.log('Lightning Renamer 网站已加载完成 ⚡');
});
