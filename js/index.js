document.addEventListener('DOMContentLoaded', () => {
    // --- [선택자들] ---
    const header = document.querySelector('header');
    const navIcon = document.querySelector('#nav-icon3');
    const menuMoBg = document.querySelector('.menu-mo-bg');
    const menuMo = document.querySelector('.menu-mo');
    const gnbMo = document.querySelector('.gnb-mo');
    const subMo = document.querySelector('.sub-mo');
    const menuBg = document.querySelector('.menu-bg');

    // [추가 포인트 1] 화면 너비 체크 함수 (1132px 이하면 모바일로 간주)
    const isMobile = () => window.innerWidth <= 1132;

    // --- [1] PC 전용 로직 ---
    const hideAllPC = () => {
        // [추가 포인트 2] 모바일일 때는 PC 숨김 로직이 간섭하지 못하게 함
        if (isMobile() || !menuBg) return; 

        menuBg.style.display = 'none';
        document.querySelectorAll('.menu-img li, .gnb-icons, .gnb-shop, .gnb-discover, .gnb-other, [class^="sub-"]').forEach(el => {
            el.style.display = 'none';
        });
    };

    const menuMapping = {
        '.m-icons': { img: '.img-main', sub: '.gnb-icons' },
        '.m-shop': { img: '.img-perfume', sub: '.gnb-shop' },
        '.m-discover': { img: '.img-main', sub: '.gnb-discover' },
        '.m-other': { img: '.img-main', sub: '.gnb-other' }
    };

    Object.keys(menuMapping).forEach(key => {
        const item = document.querySelector(key);
        if (item) {
            item.addEventListener('mouseenter', () => {
                // [추가 포인트 3] 모바일(태블릿) 터치 시 PC 호버가 발동되는 것 차단
                if (isMobile()) return; 

                hideAllPC();
                menuBg.style.display = 'block';
                const map = menuMapping[key];
                const targetImg = document.querySelector(map.img);
                const targetSub = document.querySelector(map.sub);
                if (targetImg) targetImg.style.display = 'block';
                if (targetSub) targetSub.style.display = 'block';
            });
        }
    });

    // PC: SHOP 내부 호버
    const pcShopLinks = document.querySelectorAll('.gnb-shop .sub li a');
    pcShopLinks.forEach((link) => {
        link.addEventListener('mouseenter', () => {
            if (isMobile()) return; // 모바일 차단

            document.querySelectorAll('.menu-img li, [class^="sub-"]').forEach(el => el.style.display = 'none');
            const text = link.textContent.trim().toUpperCase();
            if (text.includes('PERFUME')) {
                document.querySelector('.img-perfume').style.display = 'block';
                document.querySelector('.sub-perume').style.display = 'flex';
            } else if (text.includes('HOME FRAGRANCE')) {
                document.querySelector('.img-fragrance').style.display = 'block';
                document.querySelector('.sub-fragrance').style.display = 'flex';
            } else if (text.includes('HAND & BODY')) {
                document.querySelector('.img-body').style.display = 'block';
                document.querySelector('.sub-care').style.display = 'flex';
            } else if (text.includes('MAKEUP')) {
                document.querySelector('.img-makeup').style.display = 'block';
                document.querySelector('.sub-makeup').style.display = 'flex';
            } else if (text.includes('BYPRODUCT')) {
                document.querySelector('.img-main').style.display = 'block';
                document.querySelector('.sub-by').style.display = 'flex';
            }
        });
    });

    if (header) header.addEventListener('mouseleave', hideAllPC);


    // --- [2] 모바일 전용 로직 ---
    const resetMoMenu = () => {
        if(gnbMo) gnbMo.classList.remove('is-filtering');
        if(subMo) subMo.classList.remove('is-filtering');
        
        document.querySelectorAll('.gnb-mo > li').forEach(li => li.classList.remove('has-active-child'));
        document.querySelectorAll('.sub-mo > li').forEach(li => {
            li.classList.remove('is-active');
            li.style.display = ''; // [추가 포인트 4] display: block 대신 빈 값을 주어 CSS 미디어쿼리에 맡김
        });

        document.querySelectorAll('.menu-mo-img li').forEach(img => img.style.display = 'none');
        if(document.querySelector('.menu-mo-img .img-main')) {
            document.querySelector('.menu-mo-img .img-main').style.display = 'block';
        }
    };

    if (navIcon) {
        navIcon.addEventListener('click', () => {
            const isOpen = navIcon.classList.toggle('open');
            menuMoBg.classList.toggle('active');
            menuMo.classList.toggle('active');
            if (isOpen) {
                resetMoMenu();
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        });
    }

    const moSubLinks = document.querySelectorAll('.sub-mo > li > a');
    moSubLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // [추가 포인트 5] 모바일 너비일 때만 이 클릭 이벤트가 작동하도록 함
            if (!isMobile()) return; 

            const parentLi = this.parentElement;
            const hasSubMenu = parentLi.querySelector('.sub-menu-2');

            if (hasSubMenu) {
                e.preventDefault();
                if (parentLi.classList.contains('is-active')) {
                    resetMoMenu();
                    return;
                }
                resetMoMenu();
                if(gnbMo) gnbMo.classList.add('is-filtering');
                if(subMo) subMo.classList.add('is-filtering');
                parentLi.classList.add('is-active');
                const mainLi = parentLi.closest('.gnb-mo > li');
                if (mainLi) mainLi.classList.add('has-active-child');

                const text = this.textContent.trim().toUpperCase();
                document.querySelectorAll('.menu-mo-img li').forEach(img => img.style.display = 'none');
                let imgClass = '.img-main';
                if (text.includes('PERFUME')) imgClass = '.img-perfume';
                else if (text.includes('FRAGRANCE')) imgClass = '.img-fragrance';
                else if (text.includes('BODY')) imgClass = '.img-body';
                else if (text.includes('MAKEUP')) imgClass = '.img-makeup';

                const targetImg = document.querySelector(`.menu-mo-img ${imgClass}`);
                if (targetImg) targetImg.style.display = 'block';
            }
        });
    });

    // --- [3] 슬라이드 로직 ---
    const slideContainer = document.querySelector('.sec5 .bottom');
    if (slideContainer) {
        const slide = document.querySelector('.sec5 .slide');
        let currentIndex = 0;
        const moveSlide = () => {
            const width = window.innerWidth;
            const itemsPerView = width >= 1132 ? 4 : (width >= 768 ? 2 : 1);
            const items = document.querySelectorAll('.sec5 .slide li');
            if(items.length === 0) return;
            const maxIndex = Math.ceil(items.length / itemsPerView) - 1;
            currentIndex = (currentIndex >= maxIndex) ? 0 : currentIndex + 1;
            slide.style.transform = `translateX(-${currentIndex * 100}%)`;
        };
        let timer = setInterval(moveSlide, 3500);
        slideContainer.addEventListener('mouseenter', () => clearInterval(timer));
        slideContainer.addEventListener('mouseleave', () => timer = setInterval(moveSlide, 3500));
    }
});