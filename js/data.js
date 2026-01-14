// Data structure for Preferences and Game Stages
const GAME_DATA = {
    // 1. Preference customization (5 steps)
    preferences: [
        {
            id: 'color',
            question: "어떤 색깔이 좋아?",
            options: [
                { id: 'red', label: '빨강 (Red)', src: 'https://via.placeholder.com/200/FF0000/FFFFFF?text=Red' },
                { id: 'blue', label: '파랑 (Blue)', src: 'https://via.placeholder.com/200/0000FF/FFFFFF?text=Blue' },
                { id: 'yellow', label: '노랑 (Yellow)', src: 'https://via.placeholder.com/200/FFFF00/000000?text=Yellow' },
                { id: 'green', label: '초록 (Green)', src: 'https://via.placeholder.com/200/008000/FFFFFF?text=Green' },
                { id: 'purple', label: '보라 (Purple)', src: 'https://via.placeholder.com/200/800080/FFFFFF?text=Purple' }
            ]
        },
        {
            id: 'complexity',
            question: "어떤 그림이 좋아?",
            options: [
                { id: 'simple', label: '단순한', src: 'assets/styles/soft.png' },
                { id: 'complex', label: '복잡한', src: 'assets/styles/vibrant.png' },
                { id: 'line', label: '선 그림', src: 'assets/styles/pref_line_art.png' },
                { id: 'pixel', label: '네모네모', src: 'assets/styles/pref_pixel_art.png' },
                { id: 'real', label: '진짜 같은', src: 'https://via.placeholder.com/200?text=Real' }
            ]
        },
        {
            id: 'theme',
            question: "주제가 뭐였으면 좋겠어?",
            options: [
                { id: 'animal', label: '동물', src: 'assets/objects/cat.png' },
                { id: 'space', label: '우주', src: 'assets/styles/pref_theme_space.png' },
                { id: 'forest', label: '숲속', src: 'assets/styles/pref_theme_forest.png' },
                { id: 'sea', label: '바다', src: 'assets/objects/fish.png' },
                { id: 'city', label: '도시', src: 'assets/styles/pref_theme_city.png' }
            ]
        },
        {
            id: 'size',
            question: "크기는 어때?",
            options: [
                { id: 'small', label: '작게', src: 'https://via.placeholder.com/200?text=Small' },
                { id: 'big', label: '크게', src: 'https://via.placeholder.com/200?text=Big' },
                { id: 'full', label: '꽉 차게', src: 'https://via.placeholder.com/200?text=Full' },
                { id: 'pattern', label: '여러 개', src: 'https://via.placeholder.com/200?text=Many' },
                { id: 'tiny', label: '아주 작게', src: 'https://via.placeholder.com/200?text=Tiny' }
            ]
        },
        {
            id: 'pattern',
            question: "반복되는 게 좋아?",
            options: [
                { id: 'once', label: '하나만', src: 'https://via.placeholder.com/200?text=One' },
                { id: 'repeat', label: '반복하기', src: 'https://via.placeholder.com/200?text=Repeat' },
                { id: 'random', label: '마구마구', src: 'https://via.placeholder.com/200?text=Random' },
                { id: 'grid', label: '줄 맞춰', src: 'https://via.placeholder.com/200?text=Grid' },
                { id: 'circle', label: '빙글빙글', src: 'https://via.placeholder.com/200?text=Circle' }
            ]
        }
    ],

    // 2. Game Sequence - Progressive sentence building
    // Step 1: noun → Step 2: color + noun → Step 3: shape + color + noun → Step 4: verb + shape + color + noun → Step 5: background + verb + shape + color + noun
    stages: [
        // Step 1: Choose noun (명사)
        {
            id: 'step1_noun',
            question: "1. 무엇을 그릴까?",
            wordType: '명사',
            choices: [
                { id: 'c1', label: '사과', engLabel: 'apple', src: 'assets/objects/01_apple.jpg' },
                { id: 'c2', label: '강아지', engLabel: 'dog', src: 'assets/objects/01_dog.png' },
                { id: 'c3', label: '공룡', engLabel: 'dinosaur', src: 'assets/objects/01_dinosaur.jpg' },
                { id: 'c4', label: '비행기', engLabel: 'airplane', src: 'assets/objects/01_airplane.jpg' },
                { id: 'c5', label: '나무', engLabel: 'tree', src: 'assets/objects/01_tree.jpg' }
            ]
        },
        // Step 2: Choose color adjective (색상 형용사) - noun carries over
        {
            id: 'step2_color',
            question: "2. 무슨 색이야?",
            wordType: '색상',
            choices: [
                { id: 'c1', label: '빨간색', engLabel: 'red', src: 'assets/objects/02_red.jpg' },
                { id: 'c2', label: '파란색', engLabel: 'blue', src: 'assets/objects/02_blue.jpg' },
                { id: 'c3', label: '노란색', engLabel: 'yellow', src: 'assets/objects/02_yellow.jpg' },
                { id: 'c4', label: '초록색', engLabel: 'green', src: 'assets/objects/02_green.jpg' },
                { id: 'c5', label: '검은색', engLabel: 'black', src: 'assets/objects/02_black.jpg' }
            ]
        },
        // Step 3: Choose figurative/shape adjective (모양 형용사) - color + noun carry over
        {
            id: 'step3_shape',
            question: "3. 어떤 모양이야?",
            wordType: '모양',
            choices: [
                { id: 'c1', label: '세모', sentenceLabel: '세모난', engLabel: 'triangular', src: 'assets/objects/03_tri.jpg' },
                { id: 'c2', label: '네모', sentenceLabel: '네모난', engLabel: 'square', src: 'assets/objects/03_rec.jpg' },
                { id: 'c3', label: '동그라미', sentenceLabel: '동그란', engLabel: 'circular', src: 'assets/objects/03_circle.jpg' },
                { id: 'c4', label: '별', sentenceLabel: '별 모양', engLabel: 'star-shaped', src: 'assets/objects/03_star.jpg' },
                { id: 'c5', label: '하트', sentenceLabel: '하트 모양', engLabel: 'heart-shaped', src: 'assets/objects/03_heart.jpg' }
            ]
        },
        // Step 4: Choose verb (동사) - shape + color + noun carry over
        {
            id: 'step4_verb',
            question: "4. 무엇을 하고 있어?",
            wordType: '동사',
            choices: [
                { id: 'c1', label: '날으는', sentenceLabel: '날고 있는', engLabel: 'flying', src: 'assets/objects/04_fly.png' },
                { id: 'c2', label: '수영하는', sentenceLabel: '수영하는', engLabel: 'swimming', src: 'assets/objects/04_swim.png' },
                { id: 'c3', label: '걷는', sentenceLabel: '걷고 있는', engLabel: 'walking', src: 'assets/objects/04_walk.png' },
                { id: 'c4', label: '웃는', sentenceLabel: '웃는', engLabel: 'smiling', src: 'assets/objects/04_smile.png' },
                { id: 'c5', label: '자는', sentenceLabel: '자고 있는', engLabel: 'sleeping', src: 'assets/objects/04_sleep.png' }
            ]
        },
        // Step 5: Choose background (배경) - verb + shape + color + noun carry over
        {
            id: 'step5_background',
            question: "5. 어디에 있어?",
            wordType: '배경',
            choices: [
                { id: 'c1', label: '우주', sentenceLabel: '우주에서', engLabel: 'in space', src: 'assets/objects/05_space.jpg' },
                { id: 'c2', label: '하늘', sentenceLabel: '하늘에서', engLabel: 'in the sky', src: 'assets/objects/05_sky.jpg' },
                { id: 'c3', label: '놀이터', sentenceLabel: '놀이터에서', engLabel: 'in a playground', src: 'assets/objects/05_playground.jpg' },
                { id: 'c4', label: '사막', sentenceLabel: '사막에서', engLabel: 'in the desert', src: 'assets/objects/05_desert.jpg' },
                { id: 'c5', label: '집', sentenceLabel: '집에서', engLabel: 'in a house', src: 'assets/objects/05_house.jpg' }
            ]
        }
    ],
    result: {
        src: 'assets/loading-chargement.gif',
        sentence: "나만의 멋진 그림이 완성되었어!"
    }
};
