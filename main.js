window.onload = () => {
    const c = setTimeout(() => {
        document.body.classList.remove("not-loaded");
        clearTimeout(c);
        // Set initial volume for background music
        const audio = document.getElementById("background-music");
        audio.volume = 0.3; // Low volume to avoid being intrusive
    }, 1000);
};

$(document).ready(function () {
    var envelope = $("#envelope");
    var btn_open = $("#open");
    var btn_reset = $("#reset");
    var modal = $("#letter-modal");
    var typewriterContainer = $("#typewriter-text");
    var typingTimer;

    // Get recipient's name from URL
    const urlParams = new URLSearchParams(window.location.search);
    const recipientName = urlParams.get('name') || 'bạn'; // Default to 'bạn' if no name is provided
    const displayName = recipientName.charAt(0).toUpperCase() + recipientName.slice(1).toLowerCase();
    // Personalize letter content with recipient's name wrapped in span for highlight and emojis
    var letterLines = [
        `Chúc <span class="highlight-name">${displayName}</span> có một ngày thật đặc biệt!💐`,
        `Chúc <span class="highlight-name">${displayName}</span> luôn xinh đẹp, tự tin và tràn đầy năng lượng tích cực ✨`,
        `Mong <span class="highlight-name">${displayName}</span> luôn gặp nhiều may mắn, thành công và được yêu thương mỗi ngày ❤️`
    ];

    envelope.click(function () {
        openEnvelope();
    });
    btn_open.click(function () {
        openEnvelope();
        document.getElementById('background-music').play()
    });
    btn_reset.click(function () {
        closeEnvelope();
    });

    $("#close-modal").click(function () {
        closeModal();
    });

    $(".modal-backdrop").click(function () {
        closeModal();
    });

    function openEnvelope() {
        envelope.addClass("open").removeClass("close");
        setTimeout(function() {
            showModal();
        }, 500);
    }

    function closeEnvelope() {
        envelope.addClass("close").removeClass("open");
        closeModal();
    }

    function showModal() {
        modal.fadeIn(300);
        startTypewriter();
    }

    function closeModal() {
        modal.fadeOut(300);
        stopTypewriter();
        typewriterContainer.html("");
    }

    function stopTypewriter() {
        if (typingTimer) {
            clearTimeout(typingTimer);
            typingTimer = null;
        }
    }

    function startTypewriter() {
        stopTypewriter();
        typewriterContainer.html('<span class="caret"></span>');
        
        var lineIndex = 0;
        var charIndex = 0;
        var currentLine = "";
        var inTag = false;
        var currentTag = "";

        function typeNextChar() {
            if (lineIndex < letterLines.length) {
                currentLine = letterLines[lineIndex];
                
                if (charIndex < currentLine.length) {
                    var char = currentLine.charAt(charIndex);
                    
                    if (char === '<') {
                        inTag = true;
                        currentTag = char;
                    } else if (char === '>' && inTag) {
                        inTag = false;
                        currentTag += char;
                        typewriterContainer.find(".caret").before(currentTag);
                        currentTag = "";
                    } else if (inTag) {
                        currentTag += char;
                    } else {
                        var caretEl = typewriterContainer.find(".caret");
                        caretEl.before(char);
                    }
                    
                    charIndex++;
                    var speed = char === ' ' ? 10 : 30 + Math.floor(Math.random() * 20);
                    typingTimer = setTimeout(typeNextChar, speed);
                } else {
                    var caretEl = typewriterContainer.find(".caret");
                    caretEl.before("<br>");
                    lineIndex++;
                    charIndex = 0;
                    inTag = false;
                    currentTag = "";
                    typingTimer = setTimeout(typeNextChar, 200);
                }
            }
        }

        typeNextChar();
    }
});