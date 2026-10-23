<script setup lang="ts">
import type { Project } from '../types';

defineProps<{
  project: Project;
  label: string;
}>();
</script>

<template>
  <div class="project-art" :data-art="project.art">
    <span class="project-art__code">CASE / {{ project.index }}</span>
    <span class="project-art__type">{{ label }}</span>
    <span class="project-art__axis project-art__axis--x" aria-hidden="true"></span>
    <span class="project-art__axis project-art__axis--y" aria-hidden="true"></span>

    <div class="project-art__stage" aria-hidden="true">
      <div v-if="project.art === 'atlas'" class="project-ui project-ui--atlas">
        <div class="project-ui__chrome">
          <span></span><span></span><span></span>
          <b>CHAIN / QUERY</b>
          <em>READ ONLY</em>
        </div>
        <div class="project-query">
          <div class="project-query__prompt">
            <span class="project-query__mark">?</span>
            <div>
              <small>NATURAL LANGUAGE</small>
              <p>Revenue by region, last 7 days</p>
            </div>
            <i></i>
          </div>
          <div class="project-query__pipeline">
            <span class="is-done">01 PLAN</span>
            <i></i>
            <span class="is-active">02 SQL</span>
            <i></i>
            <span>03 VERIFY</span>
          </div>
          <div class="project-query__result">
            <div class="project-query__table">
              <span><i></i><b></b><em></em></span>
              <span><i></i><b></b><em></em></span>
              <span><i></i><b></b><em></em></span>
              <span><i></i><b></b><em></em></span>
            </div>
            <div class="project-query__chart">
              <span style="--bar: 40%"></span>
              <span style="--bar: 64%"></span>
              <span style="--bar: 48%"></span>
              <span style="--bar: 82%"></span>
              <span style="--bar: 72%"></span>
              <span style="--bar: 92%"></span>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="project.art === 'echo'" class="project-ui project-ui--resume">
        <div class="project-ui__chrome">
          <span></span><span></span><span></span>
          <b>RESUME / SCREEN</b>
          <em>AI ASSIST</em>
        </div>
        <div class="project-resume">
          <div class="project-resume__sheet">
            <span class="project-resume__portrait"></span>
            <i class="is-title"></i>
            <i class="is-contact"></i>
            <i></i><i></i>
            <div class="project-resume__columns">
              <span><b></b><b></b><b></b><b></b></span>
              <span><b></b><b></b><b></b></span>
            </div>
            <em>PDF / DOCX</em>
          </div>
          <div class="project-resume__result">
            <div class="project-resume__score">
              <span></span>
              <strong>92</strong>
              <small>FIT</small>
            </div>
            <div class="project-resume__dimensions">
              <span><small>EXPERIENCE</small><i><b style="--score: 88%"></b></i></span>
              <span><small>SKILL MATCH</small><i><b style="--score: 94%"></b></i></span>
              <span><small>STABILITY</small><i><b style="--score: 79%"></b></i></span>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="project.art === 'orbit'" class="project-ui project-ui--inspection">
        <div class="project-ui__chrome">
          <span></span><span></span><span></span>
          <b>INSPECTION / NETWORK</b>
          <em>24 ONLINE</em>
        </div>
        <div class="project-inspection">
          <div class="project-inspection__map">
            <svg viewBox="0 0 320 150" preserveAspectRatio="none">
              <path d="M-12 112 C42 72 66 118 104 92 S172 36 212 69 273 45 334 17" />
              <path d="M27 160 C49 111 99 134 137 96 S223 104 285 55 330 70 340 48" />
              <path d="M103 12 C118 48 144 55 156 90 S181 132 229 143" />
              <path d="M212 -6 C197 34 221 58 247 72 S275 116 266 158" />
            </svg>
            <span class="project-inspection__pin project-inspection__pin--one"><i></i><small>P-07</small></span>
            <span class="project-inspection__pin project-inspection__pin--two is-alert"><i></i><small>P-12</small></span>
            <span class="project-inspection__pin project-inspection__pin--three"><i></i><small>P-19</small></span>
            <span class="project-inspection__pin project-inspection__pin--four"><i></i><small>P-24</small></span>
            <div class="project-inspection__coords">30.5728 N / 104.0668 E</div>
          </div>
          <div class="project-inspection__summary">
            <span><small>PLANS</small><strong>08</strong></span>
            <span><small>TASKS</small><strong>26</strong></span>
            <span class="is-alert"><small>ALERTS</small><strong>03</strong></span>
          </div>
          <div class="project-inspection__timeline">
            <span class="is-complete"></span>
            <i class="is-complete"></i>
            <span class="is-complete"></span>
            <i></i>
            <span></span>
            <i></i>
            <span></span>
          </div>
        </div>
      </div>

      <div v-else class="project-ui project-ui--studio">
        <div class="project-ui__chrome">
          <span></span><span></span><span></span>
          <b>STUDIO / TASKS</b>
          <em>LIVE SYNC</em>
        </div>
        <div class="project-studio">
          <div class="project-studio__rail">
            <span class="is-active">AA</span>
            <span>01</span>
            <span>02</span>
            <i></i>
            <span>+</span>
          </div>
          <div class="project-studio__board">
            <div class="project-studio__header">
              <span>SHOT / 042</span>
              <small>VFX REVIEW</small>
            </div>
            <div class="project-studio__rows">
              <span><i class="is-cyan"></i><b>Plate cleanup</b><em>04</em></span>
              <span><i class="is-pink"></i><b>Color grade</b><em>08</em></span>
              <span><i class="is-amber"></i><b>Final composite</b><em>12</em></span>
            </div>
            <div class="project-studio__frames">
              <span></span><span></span><span></span>
            </div>
          </div>
          <div class="project-studio__fps">
            <small>PERFORMANCE</small>
            <strong>58<em>FPS</em></strong>
            <div>
              <span style="--level: 30%"></span>
              <span style="--level: 48%"></span>
              <span style="--level: 42%"></span>
              <span style="--level: 68%"></span>
              <span style="--level: 82%"></span>
              <span style="--level: 92%"></span>
              <span style="--level: 100%"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
