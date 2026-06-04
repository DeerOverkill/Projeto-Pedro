document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializar Ícones Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Selecionar Elementos da Linha do Tempo
    const timeline = document.querySelector('.timeline-container');
    const glowBall = document.getElementById('glow-ball');
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineCards = document.querySelectorAll('.timeline-card');

    let currentActiveIndex = 0;
    let isHoveringCard = false;

    // Função para obter o deslocamento de um elemento relativo ao container da timeline
    function getDotCenterY(item) {
        const dot = item.querySelector('.timeline-dot');
        if (!dot) return 0;
        
        // Posição vertical do centro da bolinha em relação ao container da timeline
        const timelineRect = timeline.getBoundingClientRect();
        const dotRect = dot.getBoundingClientRect();
        
        return dotRect.top - timelineRect.top + (dotRect.height / 2);
    }

    // Função para posicionar a bolinha brilhante
    function updateBallPosition(targetY, glowClass = '') {
        if (glowBall) {
            glowBall.style.top = `${targetY}px`;
            
            if (glowClass === 'hover') {
                glowBall.style.transform = 'translate(-50%, -50%) scale(1.3)';
                glowBall.style.boxShadow = '0 0 15px #fff, 0 0 30px var(--accent-cyan), 0 0 50px var(--accent-purple), 0 0 80px var(--accent-purple)';
            } else {
                glowBall.style.transform = 'translate(-50%, -50%) scale(1)';
                glowBall.style.boxShadow = '0 0 10px #fff, 0 0 20px var(--accent-cyan), 0 0 40px var(--accent-purple), 0 0 60px var(--accent-purple)';
            }
        }
    }

    // 3. Rastreamento por Scroll (Intersection Observer)
    // Monitora qual card está cruzando o centro da tela
    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -40% 0px', // Gatilho em torno da área central vertical da tela
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const item = card.closest('.timeline-item');
                const index = parseInt(card.getAttribute('data-index'), 10);
                
                currentActiveIndex = index;
                
                // Ativar classe ativa no dot correspondente
                timelineItems.forEach((el, i) => {
                    if (i === index) {
                        el.classList.add('active');
                    } else {
                        el.classList.remove('active');
                    }
                });

                // Se o usuário não estiver passando o mouse sobre nenhum card, a bolinha segue o scroll ativo
                if (!isHoveringCard) {
                    const targetY = getDotCenterY(item);
                    updateBallPosition(targetY);
                }
            }
        });
    }, observerOptions);

    timelineCards.forEach(card => {
        observer.observe(card);
    });

    // 4. Interação Magnética ao Passar o Mouse (Hover Cards)
    timelineItems.forEach((item, index) => {
        const card = item.querySelector('.timeline-card');
        
        if (card) {
            card.addEventListener('mouseenter', () => {
                isHoveringCard = true;
                const targetY = getDotCenterY(item);
                updateBallPosition(targetY, 'hover');
            });

            card.addEventListener('mouseleave', () => {
                isHoveringCard = false;
                
                // Volta suavemente para a posição do card que está ativo no scroll
                const activeItem = timelineItems[currentActiveIndex];
                if (activeItem) {
                    const targetY = getDotCenterY(activeItem);
                    updateBallPosition(targetY);
                }
            });
        }
    });

    // 5. Garantir que a bolinha alinhe corretamente após redimensionamento da tela
    window.addEventListener('resize', () => {
        if (!isHoveringCard) {
            const activeItem = timelineItems[currentActiveIndex];
            if (activeItem) {
                const targetY = getDotCenterY(activeItem);
                updateBallPosition(targetY);
            }
        }
    });

    // Timeout inicial para garantir que fontes/estilos carreguem e meçam corretamente
    setTimeout(() => {
        const activeItem = timelineItems[currentActiveIndex];
        if (activeItem) {
            const targetY = getDotCenterY(activeItem);
            updateBallPosition(targetY);
        }
    }, 300);


    // 6. Destaque Ativo de Links da Navbar ao Rolar a Página
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('main, section[id]');

    window.addEventListener('scroll', () => {
        let currentSectionId = 'inicio';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= (sectionTop - 180)) {
                currentSectionId = section.getAttribute('id') || 'inicio';
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });
});
