<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { ArrowDown, ArrowRight, ArrowUpRight, Copy, MapPin } from 'lucide-vue-next';
import BlogShell from '../components/BlogShell.vue';
import ArticleCard from '../components/ArticleCard.vue';
import { usePreferences } from '../composables/preferences';
import { categories, metrics, profile, projects, skillGroups } from '../data/site';
import { publicApi } from '../services/api';
import type { Article } from '../types';

const { locale, text } = usePreferences();
const articles = ref<Article[]>([]);
const loading = ref(true);
const copied = ref(false);
const featured = computed(() => articles.value.filter((article) => article.featured).slice(0, 2).concat(articles.value.filter((article) => !article.featured).slice(0, Math.max(0, 2 - articles.value.filter((article) => article.featured).length))));
const visibleProjects = projects;

onMounted(async () => {
  try { articles.value = await publicApi.listArticles(); } finally { loading.value = false; }
});

const copyEmail = async () => {
  try {
    await navigator.clipboard.writeText('hello@linche.example');
    copied.value = true;
    window.setTimeout(() => { copied.value = false; }, 2200);
  } catch { copied.value = false; }
};
</script>

<template>
  <BlogShell>
    <main id="main">
      <section id="home" class="hero container">
        <div class="hero-rail"><span>PORTFOLIO / JOURNAL</span><i></i><span>31.2304° N / 121.4737° E</span></div>
        <div class="hero-copy">
          <div class="availability"><i></i>{{ locale === 'zh' ? '目前接受新的创意项目' : 'Available for select projects' }}</div>
          <p class="hero-role">{{ text(profile.role) }}</p>
          <h1>{{ text(profile.heroLineOne) }}<em>{{ text(profile.heroLineTwo) }}</em></h1>
          <p class="hero-intro">{{ text(profile.intro) }}</p>
          <div class="hero-actions"><RouterLink class="button button-primary" to="/articles">{{ locale === 'zh' ? '阅读最近文章' : 'Read recent notes' }} <ArrowRight :size="17" /></RouterLink><a class="button button-ghost" href="#about">{{ locale === 'zh' ? '关于我' : 'About me' }} <span class="orbit-dot"></span></a></div>
        </div>
        <div class="hero-orbit" aria-hidden="true"><span class="orbit-label orbit-label-top">REALTIME · THREE.JS</span><span class="orbit-label orbit-label-bottom">60 FPS · WEBGL 2.0</span><i class="orbit-core"></i><i class="orbit-ring ring-a"></i><i class="orbit-ring ring-b"></i><i class="orbit-cross cross-a"></i><i class="orbit-cross cross-b"></i></div>
        <div class="hero-available"><span>LC / 2026</span><strong>{{ text(profile.signature) }}</strong><small><MapPin :size="13" />{{ text(profile.location) }}</small></div>
        <a class="scroll-cue" href="#featured"><span></span>{{ locale === 'zh' ? '向下探索' : 'Scroll to explore' }} <ArrowDown :size="13" /></a>
      </section>

      <section id="featured" class="section container section-featured">
        <div class="section-heading"><div><p class="eyebrow">{{ locale === 'zh' ? '精选阅读' : 'SELECTED NOTES' }}</p><h2>{{ locale === 'zh' ? '最近写下的一些事。' : 'Recently written.' }}</h2></div><RouterLink class="text-link" to="/articles">{{ locale === 'zh' ? '查看全部文章' : 'All articles' }} <ArrowUpRight :size="16" /></RouterLink></div>
        <div v-if="loading" class="section-loading">{{ locale === 'zh' ? '正在校准轨道…' : 'Calibrating orbit…' }}</div>
        <div v-else-if="featured.length" class="featured-grid"><ArticleCard v-for="(article, index) in featured" :key="article._id" :article="article" :featured="index === 0" /></div>
        <div v-else class="empty-inline">{{ locale === 'zh' ? '还没有已发布的文章。' : 'No published articles yet.' }} <RouterLink to="/admin/login">{{ locale === 'zh' ? '管理员登录' : 'Admin sign in' }}</RouterLink></div>
      </section>

      <section id="work" class="section container section-work">
        <div class="section-heading"><div><p class="eyebrow">{{ locale === 'zh' ? '实验与作品' : 'EXPERIMENTS & WORK' }}</p><h2>{{ locale === 'zh' ? '四个被认真对待的世界。' : 'Four worlds built with care.' }}</h2><p class="section-intro">{{ locale === 'zh' ? '每个项目都从一个具体问题出发，以可用的界面、克制的动效和可持续的代码收尾。' : 'Each project begins with a specific problem and ends with a usable interface, restrained motion, and sustainable code.' }}</p></div><a class="text-link" href="#about">{{ locale === 'zh' ? '了解我的方法' : 'How I work' }} <ArrowUpRight :size="16" /></a></div>
        <div class="project-grid"><article v-for="project in visibleProjects" :key="project.id" class="project-card"><div class="project-art" :data-art="project.art"><div class="art-grid"></div><span class="art-code">{{ project.index }} / {{ project.year }}</span><span class="art-type">{{ text(project.type) }}</span><i class="art-orbit"></i><i class="art-core"></i></div><div class="project-body"><div class="project-meta"><span>{{ text(project.type) }}</span><span>{{ project.year }}</span></div><h3>{{ text(project.title) }}</h3><p>{{ text(project.summary) }}</p><div class="project-bottom"><div class="stack-list"><span v-for="tech in project.stack" :key="tech">{{ tech }}</span></div><ArrowUpRight :size="17" /></div></div></article></div>
      </section>

      <section id="articles" class="section container section-notes">
        <div class="section-heading"><div><p class="eyebrow">04 / {{ locale === 'zh' ? '最近书写' : 'RECENT NOTES' }}</p><h2>{{ locale === 'zh' ? '在代码、空间与人的感受之间。' : 'Between code, space, and human feeling.' }}</h2><p class="section-intro">{{ locale === 'zh' ? '记录构建过程中的判断、取舍与实践。筛选一种主题，或者直接打开一篇慢慢读。' : 'Notes on decisions, trade-offs, and practice. Pick a theme, or open one and take your time.' }}</p></div><RouterLink to="/articles" class="text-link">{{ locale === 'zh' ? '浏览全部' : 'Browse all' }} <ArrowRight :size="16" /></RouterLink></div>
        <div class="home-category-row"><RouterLink v-for="category in categories.slice(1)" :key="category.id" :to="{ path: '/articles', query: { category: category.id } }"><span>{{ category.code }}</span>{{ text(category.label) }}<ArrowUpRight :size="14" /></RouterLink></div>
        <div class="compact-article-grid"><ArticleCard v-for="article in articles.slice(0, 3)" :key="article._id" :article="article" /></div>
      </section>

      <section class="section container section-skills"><div class="section-heading"><div><p class="eyebrow">03 / {{ locale === 'zh' ? '能力图谱' : 'CAPABILITIES' }}</p><h2>{{ locale === 'zh' ? '不止是技术栈，更是一套把想法推向真实世界的方法。' : 'More than a stack: a way to move ideas into the real world.' }}</h2><p class="section-intro">{{ locale === 'zh' ? '从视觉原型到可交付产品，我愿意对体验、性能与细节负责。' : 'From visual prototype to production, I take ownership of experience, performance, and detail.' }}</p></div></div><div class="skill-grid"><article v-for="group in skillGroups" :key="group.code"><span class="skill-code">{{ group.code }} / CAPABILITY</span><h3>{{ text(group.title) }}</h3><p>{{ text(group.description) }}</p><div class="skill-tags"><span v-for="skill in group.skills" :key="skill">{{ skill }}</span></div></article></div></section>

      <section id="categories" class="section container section-categories"><div class="section-heading"><div><p class="eyebrow">05 / {{ locale === 'zh' ? '内容分类' : 'CATEGORIES' }}</p><h2>{{ locale === 'zh' ? '顺着兴趣，找到下一条轨迹。' : 'Follow an interest to the next orbit.' }}</h2></div></div><div class="category-grid"><RouterLink v-for="category in categories.slice(1)" :key="category.id" :to="{ path: '/articles', query: { category: category.id } }"><span>{{ category.code }}</span><h3>{{ text(category.label) }}</h3><p>{{ text(category.description) }}</p><ArrowUpRight :size="18" /></RouterLink></div></section>

      <section id="about" class="section container section-about"><div class="about-layout"><div class="portrait-panel"><div class="portrait-rings"><span>LC</span><i></i><b></b></div><div class="portrait-caption"><span>DESIGN ENGINEER</span><span>31° N / 121° E</span></div></div><div class="about-copy"><p class="eyebrow">06 / {{ locale === 'zh' ? '关于我' : 'ABOUT ME' }}</p><h2>{{ locale === 'zh' ? '把想象编译成可以被触摸的体验。' : 'Compiling imagination into experiences you can feel.' }}</h2><p class="about-lead">{{ locale === 'zh' ? '我是林澈，一名游走在设计与工程交界处的创意开发者。用代码构建光、空间与情绪，也关心一个界面在键盘、屏幕和慢网络里是否依然从容。' : "I'm Lin Che, a creative developer working where design and engineering meet. I build light, space, and emotion with code—and care how an interface works on a keyboard, a small screen, or a slow network." }}</p><p>{{ locale === 'zh' ? '过去五年，我把复杂的数据、品牌故事和实验性交互变成可用的数字产品。喜欢从一张草图开始，一路打磨到每一帧的节奏。' : "For five years, I've turned complex data, brand stories, and experimental interactions into usable digital products." }}</p><div class="about-location"><MapPin :size="15" /> {{ locale === 'zh' ? '上海 / 远程协作 / GMT+8' : 'Shanghai / Remote / GMT+8' }}</div></div></div><div class="metrics-grid"><div v-for="metric in metrics" :key="metric.value"><strong>{{ metric.value }}<small>{{ metric.suffix }}</small></strong><span>{{ text(metric.label) }}</span></div></div></section>

      <section class="section container section-journey"><div class="section-heading"><div><p class="eyebrow">07 / {{ locale === 'zh' ? '时间坐标' : 'JOURNEY' }}</p><h2>{{ locale === 'zh' ? '沿着时间，持续向未知偏移。' : 'Following time, drifting toward the unknown.' }}</h2></div></div><div class="timeline"><article v-for="item in [{year:'2021',zh:'第一束信号',en:'First signal',role:'独立工作室 / 前端开发'},{year:'2023',zh:'进入空间叙事',en:'Enter spatial storytelling',role:'数字体验机构 / 创意开发'},{year:'2025',zh:'让技术变得安静',en:'Making technology quiet',role:'创意技术负责人'},{year:'NOW',zh:'持续向未知偏移',en:'Still drifting',role:'独立创意开发者'}]" :key="item.year"><span>{{ item.year }}</span><div><h3>{{ locale === 'zh' ? item.zh : item.en }}</h3><p>{{ item.role }}</p></div></article></div></section>

      <section id="contact" class="section container section-contact"><div class="contact-panel"><p class="eyebrow">08 / {{ locale === 'zh' ? '建立连接' : 'GET IN TOUCH' }}</p><h2>{{ locale === 'zh' ? '下一段轨迹，一起绘制。' : "Let's chart the next orbit together." }}</h2><p>{{ locale === 'zh' ? '如果你正在构思一个有野心的数字体验，或者只是想交换一个关于网页空间感的想法，欢迎来信。' : "If you're shaping an ambitious digital experience—or want to trade ideas about space on the web—my inbox is open." }}</p><div class="contact-actions"><a class="button button-primary" href="mailto:hello@linche.example">hello@linche.example <ArrowUpRight :size="16" /></a><button class="button button-ghost" type="button" @click="copyEmail"><Copy :size="15" /> {{ copied ? (locale === 'zh' ? '邮箱已复制' : 'Copied') : (locale === 'zh' ? '复制邮箱' : 'Copy email') }}</button></div><div class="contact-coordinate"><span>01 / EMAIL</span><strong>hello@linche.example</strong><span>02 / WECHAT</span><strong>orbit_linche</strong><span>03 / LOCATION</span><strong>{{ locale === 'zh' ? '上海，中国' : 'Shanghai, China' }}</strong></div></div></section>
    </main>
  </BlogShell>
</template>
