<script setup lang="ts">
import { computed, inject, onMounted, ref, watch, type Ref } from 'vue';
import { RouterLink } from 'vue-router';
import BlogShell from '../components/BlogShell.vue';
import ArticleCard from '../components/ArticleCard.vue';
import ProjectArtwork from '../components/ProjectArtwork.vue';
import { usePreferences } from '../composables/preferences';
import { categories, contacts, fallbackArticles, metrics, profile, projects, skillGroups, techStack, timeline } from '../data/site';
import { publicApi } from '../services/api';
import { articleSearchText } from '../services/articleLocale';
import type { Article } from '../types';

const { locale, text } = usePreferences();
const showToast = inject<(message: string) => void>('showToast', () => undefined);
const bootReady = inject<Readonly<Ref<boolean>>>('bootReady', ref(true));
const articles = ref<Article[]>([]);
const loading = ref(true);
const error = ref('');
const query = ref('');
const filter = ref('all');

const featured = computed(() => {
  const selected = articles.value.filter((article) => article.featured);
  return selected.concat(articles.value.filter((article) => !article.featured))
    .slice(0, 2);
});

const filteredArticles = computed(() => {
  const search = query.value.trim().toLocaleLowerCase(locale.value === 'zh' ? 'zh-CN' : 'en-US');
  return articles.value.filter((article) => {
    if (filter.value !== 'all' && article.category !== filter.value) return false;
    if (!search) return true;
    return articleSearchText(article)
      .toLocaleLowerCase(locale.value === 'zh' ? 'zh-CN' : 'en-US')
      .includes(search);
  });
});

const categoryCount = (id: string) => articles.value.filter((article) => article.category === id).length;
const chooseCategory = (id: string) => {
  filter.value = id;
  window.requestAnimationFrame(() => {
    document.querySelector('#articles')?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    });
  });
};
const clearFilters = () => {
  query.value = '';
  filter.value = 'all';
};
const copyEmail = async () => {
  try {
    await navigator.clipboard.writeText(profile.email);
    showToast(locale.value === 'zh' ? '邮箱已复制' : 'Email copied');
  } catch {
    showToast(locale.value === 'zh' ? '复制失败，请手动选择邮箱' : 'Copy failed. Please select the email manually.');
  }
};

const copyValue = async (value: string) => {
  try {
    await navigator.clipboard.writeText(value);
    showToast(locale.value === 'zh' ? '已复制到剪贴板' : 'Copied to clipboard');
  } catch {
    showToast(locale.value === 'zh' ? '复制失败，请手动选择内容' : 'Copy failed. Please select the text manually.');
  }
};

const waitForBoot = () => {
  if (bootReady.value) return Promise.resolve();
  return new Promise<void>((resolve) => {
    const stop = watch(bootReady, (ready) => {
      if (!ready) return;
      stop();
      resolve();
    });
  });
};

onMounted(async () => {
  let loadedArticles: Article[];
  let loadError = '';
  try {
    loadedArticles = await publicApi.listArticles();
  } catch (reason) {
    loadError = reason instanceof Error ? reason.message : '';
    loadedArticles = fallbackArticles;
  }

  await waitForBoot();
  articles.value = loadedArticles;
  error.value = loadError;
  loading.value = false;
});
</script>

<template>
  <BlogShell>
    <main id="main">
      <section class="hero" id="home" aria-labelledby="hero-title">
        <div class="hero__rail" aria-hidden="true">
          <span>PORTFOLIO / JOURNAL</span>
          <span class="hero__rail-line"></span>
          <span>{{ profile.coordinates }}</span>
        </div>

        <div class="hero__copy">
          <div class="availability">
            <span class="availability__dot"></span>
            <span>{{ locale === 'zh' ? '目前开放前端开发机会' : 'Open to frontend opportunities' }}</span>
          </div>
          <p class="hero__role">{{ text(profile.role) }}</p>
          <h1 id="hero-title">
            <span>{{ text(profile.heroLineOne) }}</span>
            <em>{{ text(profile.heroLineTwo) }}</em>
          </h1>
          <p class="hero__intro">{{ text(profile.intro) }}</p>
          <div class="hero__actions">
            <a class="button button--primary" href="#work" data-magnetic>
              <span>{{ locale === 'zh' ? '查看项目' : 'View projects' }}</span>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
            </a>
            <a class="button button--ghost" href="#about" data-magnetic>
              <span>{{ locale === 'zh' ? '我的' : 'About me' }}</span>
              <span class="button__orbit" aria-hidden="true"></span>
            </a>
          </div>
        </div>

        <div class="hero__visual" aria-hidden="true">
          <div class="hero__orbital-label hero__orbital-label--top">
            <span>VUE 3</span><span>TYPESCRIPT</span>
          </div>
          <div class="hero__orbital-label hero__orbital-label--bottom">
            <span>AI AGENT</span><span>WEB PERFORMANCE</span>
          </div>
          <div class="hero__crosshair hero__crosshair--one"></div>
          <div class="hero__crosshair hero__crosshair--two"></div>
        </div>

        <div class="hero__available-card">
          <span class="hero__available-code">LY / 2026</span>
          <strong>{{ text(profile.signature) }}</strong>
          <span>{{ text(profile.location) }}</span>
        </div>

        <a class="scroll-cue" href="#featured">
          <span class="scroll-cue__line" aria-hidden="true"></span>
          <span>{{ locale === 'zh' ? '向下探索' : 'Scroll to explore' }}</span>
        </a>
      </section>

      <section class="section section--featured" id="featured" aria-labelledby="featured-title">
        <div class="section-heading reveal">
          <div>
            <p class="eyebrow">{{ locale === 'zh' ? '精选阅读' : 'Selected notes' }}</p>
            <h2 id="featured-title">{{ locale === 'zh' ? '最近写下的一些事。' : 'Recently written.' }}</h2>
          </div>
          <a class="text-link" href="#articles">
            <span>{{ locale === 'zh' ? '查看全部文章' : 'View all notes' }}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
          </a>
        </div>
        <div v-if="loading" class="featured-grid" aria-busy="true">
          <div class="note-card"></div>
          <div class="note-card"></div>
        </div>
        <div v-else class="featured-grid">
          <ArticleCard v-for="(article, index) in featured" :key="article._id" :article="article" :index="index" featured />
        </div>
      </section>

      <section class="section section--work" id="work" aria-labelledby="work-title">
        <div class="section-heading reveal">
          <div>
            <p class="eyebrow">{{ locale === 'zh' ? '实验与作品' : 'Experiments & work' }}</p>
            <h2 id="work-title">{{ locale === 'zh' ? '把真实业务，做成好用的产品。' : 'Real products, built with care.' }}</h2>
          </div>
          <a class="text-link" href="#about">
            <span>{{ locale === 'zh' ? '了解我的方法' : 'How I work' }}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
          </a>
        </div>
        <div class="project-grid">
          <article v-for="project in projects" :key="project.id" class="project-card">
            <ProjectArtwork :project="project" :label="text(project.type)" />
            <div class="project-card__content">
              <div class="project-card__meta">
                <span>{{ text(project.type) }}</span>
                <span>{{ project.year }}</span>
              </div>
              <h3>{{ text(project.title) }}</h3>
              <p>{{ text(project.summary) }}</p>
              <div class="project-card__bottom">
                <span class="project-card__stack">{{ project.stack.join(' / ') }}</span>
                <span class="card-arrow" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
                </span>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section class="section section--articles" id="articles" aria-labelledby="articles-title">
        <div class="section-heading section-heading--wide reveal">
          <div>
            <p class="eyebrow">{{ locale === 'zh' ? '02 / 全部文章' : '02 / All articles' }}</p>
            <h2 id="articles-title" tabindex="-1">{{ locale === 'zh' ? '一些值得展开的想法。' : 'Ideas worth unfolding.' }}</h2>
            <p class="section-intro">{{ locale === 'zh' ? '从实时图形到交互细节，记录每一次判断背后的原因。先选择方向，再打开一篇慢慢读。' : 'From realtime graphics to interaction detail, these notes uncover the reasoning behind each decision. Pick a direction, then open one and take your time.' }}</p>
          </div>
          <div class="article-tools">
            <label class="search-field" for="article-search">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="6.5"></circle>
                <path d="m16 16 4.5 4.5"></path>
              </svg>
              <input
                id="article-search"
                v-model="query"
                name="article-search"
                type="search"
                autocomplete="off"
                enterkeyhint="search"
                :placeholder="locale === 'zh' ? '搜索标题、标签…' : 'Search titles, tags…'"
                :aria-label="locale === 'zh' ? '搜索文章' : 'Search articles'"
              />
            </label>
          </div>
        </div>

        <div class="archive-bar reveal">
          <div class="filter-list" role="group" :aria-label="locale === 'zh' ? '文章分类' : 'Article categories'">
            <button
              v-for="item in categories"
              :key="item.id"
              class="filter-button"
              :class="{ 'is-active': filter === item.id }"
              type="button"
              :aria-pressed="filter === item.id"
              @click="filter = item.id"
            >{{ text(item.label) }}</button>
          </div>
          <p class="archive-count"><span>{{ String(filteredArticles.length).padStart(2, '0') }}</span> / {{ String(articles.length).padStart(2, '0') }}</p>
          <p class="sr-only" role="status" aria-live="polite">
            {{ locale === 'zh' ? `显示 ${filteredArticles.length} 条匹配结果。` : `Showing ${filteredArticles.length} matching results.` }}
          </p>
        </div>

        <div v-if="loading" class="article-grid archive-skeleton" aria-busy="true">
          <div class="note-card"></div><div class="note-card"></div>
        </div>
        <div v-else-if="filteredArticles.length" class="article-grid">
          <ArticleCard v-for="(article, index) in filteredArticles" :key="article._id" :article="article" :index="index" />
        </div>
        <div v-else class="empty-state">
          <span class="empty-state__orbit" aria-hidden="true"></span>
          <p>{{ error || (locale === 'zh' ? '这个主题暂时还没有文章。' : 'No notes in this theme yet.') }}</p>
          <button class="text-button" type="button" @click="clearFilters">{{ locale === 'zh' ? '清除筛选' : 'Clear filters' }}</button>
        </div>
      </section>

      <section class="section section--categories" id="categories" aria-labelledby="categories-title">
        <div class="section-heading section-heading--wide reveal">
          <div>
            <p class="eyebrow">{{ locale === 'zh' ? '03 / 内容分类' : '03 / Categories' }}</p>
            <h2 id="categories-title">{{ locale === 'zh' ? '顺着兴趣，找到下一条轨迹。' : 'Follow an interest to the next orbit.' }}</h2>
            <p class="section-intro">{{ locale === 'zh' ? '文章按照关注的方向组织。切换分类会立即更新文章列表，并保留在当前页面。' : 'Notes are organized by direction. Selecting a category updates the article list while keeping you on this page.' }}</p>
          </div>
        </div>
        <div class="category-grid">
          <button
            v-for="item in categories.slice(1)"
            :key="item.id"
            class="category-card"
            :class="{ 'is-active': filter === item.id }"
            type="button"
            :aria-pressed="filter === item.id"
            @click="chooseCategory(item.id)"
          >
            <span class="category-card__index">{{ item.code }} / FIELD</span>
            <h3>{{ text(item.label) }}</h3>
            <p>{{ text(item.description) }}</p>
            <span class="category-card__footer">
              <span>{{ String(categoryCount(item.id)).padStart(2, '0') }} {{ locale === 'zh' ? '篇文章' : 'notes' }}</span>
              <strong aria-hidden="true">↗</strong>
            </span>
          </button>
        </div>
      </section>

      <section class="section section--about" id="about" aria-labelledby="about-title">
        <div class="about-layout">
          <div class="portrait-panel reveal">
            <div class="portrait-panel__frame">
              <div class="portrait-panel__rings" aria-hidden="true">
                <span></span><span></span><span></span>
              </div>
              <div class="portrait-panel__monogram" aria-hidden="true">LY</div>
              <span class="portrait-panel__scan"></span>
            </div>
            <div class="portrait-panel__meta">
              <span>FRONTEND DEVELOPER</span>
              <span>BASED IN CHENGDU</span>
            </div>
          </div>

          <div class="about-copy reveal">
            <p class="eyebrow">{{ locale === 'zh' ? '04 / 关于我' : '04 / About me' }}</p>
            <h2 id="about-title">{{ locale === 'zh' ? '把复杂业务，变成可靠的前端产品。' : 'Turning complex products into reliable frontend experiences.' }}</h2>
            <p class="about-copy__lead">{{ locale === 'zh' ? '我是 LY，一名专注 Vue 3、TypeScript 与 AI 应用开发的前端开发者。我喜欢把复杂流程拆成清晰状态，让业务页面既好理解，也能稳定交付。' : "I'm LY, a frontend developer focused on Vue 3, TypeScript, and AI-powered products. I turn complex workflows into clear states, making product pages easier to understand and more dependable to ship." }}</p>
            <p>{{ locale === 'zh' ? '从影视协作平台的长列表优化，到燃气巡检平台的组件复用，再到 Chain-NL2SQL 的 Agent 编排，我持续在真实业务中打磨前端架构、性能与全链路协作能力。' : 'From long-list performance in a production platform to shared components in safety inspection and agent orchestration in Chain-NL2SQL, I keep sharpening frontend architecture, performance, and end-to-end delivery through real products.' }}</p>
            <div class="about-copy__meta">
              <span>{{ locale === 'zh' ? '前端开发 · AI 应用实践者' : 'Frontend developer · Applied AI' }}</span>
              <span>Chengdu / Remote / GMT+8</span>
            </div>
          </div>
        </div>

        <div class="metrics-grid">
          <div v-for="metric in metrics" :key="metric.value" class="metric">
            <span class="metric__value">{{ metric.value }}<small class="metric__suffix">{{ metric.suffix }}</small></span>
            <span class="metric__label">{{ text(metric.label) }}</span>
          </div>
        </div>

        <div class="skills-panel">
          <div class="skills-panel__heading reveal">
            <p class="eyebrow">CAPABILITY MAP / 03</p>
            <h3>{{ locale === 'zh' ? '不止是技术栈，更是一套把想法推向真实世界的方法。' : 'More than a stack—a way of moving ideas into the real world.' }}</h3>
            <p>{{ locale === 'zh' ? '从视觉原型到可交付产品，我愿意对体验、性能与细节负责。拖动视角，让能力图谱随你的指针流动。' : 'From visual prototype to production, I take ownership of experience, performance, and detail. Move your pointer and let the map flow with you.' }}</p>
          </div>
          <div class="skills-orbit">
            <div class="skills-orbit__core" aria-hidden="true">
              <span>LY</span>
              <small>CORE</small>
            </div>
            <article
              v-for="(group, index) in skillGroups"
              :key="group.code"
              class="skill-group"
              :class="`skill-group--${['top-left', 'top-right', 'bottom'][index] ?? 'bottom'}`"
            >
              <span class="skill-group__code">{{ group.code }} / CAPABILITY</span>
              <h4>{{ text(group.title) }}</h4>
              <p>{{ text(group.description) }}</p>
              <div class="skill-tags"><span v-for="skill in group.skills" :key="skill">{{ skill }}</span></div>
            </article>
          </div>

          <section class="tech-stack reveal" aria-labelledby="tech-stack-title">
            <div class="tech-stack__heading">
              <div>
                <p class="eyebrow">TOOLKIT / FULL STACK</p>
                <h4 id="tech-stack-title">{{ locale === 'zh' ? '完整技术栈' : 'Full technology stack' }}</h4>
              </div>
              <p>{{ locale === 'zh' ? '从页面实现、组件工程到 AI 应用与后端接口，覆盖简历中列出的常用技术。' : 'From interface implementation and component engineering to applied AI and backend APIs, covering the tools listed across my resume.' }}</p>
            </div>
            <div class="tech-stack__grid">
              <article v-for="group in techStack" :key="group.code" class="tech-stack__group">
                <header>
                  <span>{{ group.code }}</span>
                  <h5>{{ text(group.title) }}</h5>
                </header>
                <ul>
                  <li v-for="skill in group.skills" :key="skill">{{ skill }}</li>
                </ul>
              </article>
            </div>
          </section>
        </div>

        <div class="journey">
          <div class="section-heading reveal">
            <div>
              <p class="eyebrow">05 / JOURNEY</p>
              <h2>{{ locale === 'zh' ? '沿着时间，持续向未知偏移。' : 'Following time, drifting toward the unknown.' }}</h2>
            </div>
          </div>
          <div class="timeline">
            <article v-for="(item, index) in timeline" :key="`${item.year}-${index}`" class="timeline-item">
              <span class="timeline-item__year">{{ item.year }}</span>
              <h4>{{ text(item.title) }}</h4>
              <span class="timeline-item__company">{{ text(item.company) }}</span>
              <p>{{ text(item.description) }}</p>
            </article>
          </div>
        </div>

        <div class="contact-panel reveal">
          <div class="contact-panel__glow" aria-hidden="true"></div>
          <p class="eyebrow">06 / GET IN TOUCH</p>
          <h2 id="contact-title" tabindex="-1">{{ locale === 'zh' ? '有合适的前端机会，欢迎聊聊。' : 'Have a frontend role in mind? Let’s talk.' }}</h2>
          <p>{{ locale === 'zh' ? '如果你正在寻找熟悉 Vue 3、TypeScript 与 AI 应用开发的前端伙伴，或者想交流工程实践，欢迎来信。' : 'If you are looking for a frontend developer with Vue 3, TypeScript, and applied AI experience—or want to compare notes on engineering practice—my inbox is open.' }}</p>
          <div class="contact-panel__actions">
            <a class="button button--primary" :href="`mailto:${profile.email}`">
              <span>{{ locale === 'zh' ? '发送邮件' : 'Send an email' }}</span>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
            </a>
            <button class="button button--ghost" type="button" @click="copyEmail">
              <span>{{ locale === 'zh' ? '复制邮箱' : 'Copy email' }}</span>
            </button>
          </div>
          <div class="contact-list">
            <component
              :is="contact.action === 'link' ? 'a' : contact.action === 'copy' ? 'button' : 'div'"
              v-for="contact in contacts"
              :key="contact.id"
              class="contact-list__item"
              :type="contact.action === 'copy' ? 'button' : undefined"
              :href="contact.action === 'link' ? contact.href : undefined"
              :target="contact.action === 'link' && contact.external ? '_blank' : undefined"
              :rel="contact.action === 'link' && contact.external ? 'noreferrer' : undefined"
              @click="contact.action === 'copy' ? copyValue(typeof contact.value === 'string' ? contact.value : text(contact.value)) : undefined"
            >
              <span>{{ text(contact.label) }}</span>
              <strong>{{ typeof contact.value === 'string' ? contact.value : text(contact.value) }}</strong>
            </component>
          </div>
        </div>
      </section>
    </main>
  </BlogShell>
</template>
