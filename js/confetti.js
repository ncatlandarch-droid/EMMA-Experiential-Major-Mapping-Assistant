/**
 * EMMA C2C — Confetti Engine
 * Canvas-based confetti burst for milestone achievements.
 * Fires on milestone completion; bigger burst at phase/program completion.
 */

window.EMMA_CONFETTI = (() => {
  'use strict';

  const COLORS = [
    '#003D7D', // A&T Blue
    '#F1C72F', // A&T Gold
    '#22C55E', // Success green
    '#7C3AED', // ISLA purple
    '#F97316', // Energy orange
    '#EC4899', // Celebration pink
    '#0EA5E9', // Sky blue
    '#10B981', // Emerald
  ];

  let canvas, ctx;
  let particles = [];
  let animating = false;

  function init() {
    canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
    console.log('[EMMA_CONFETTI] ✅ Confetti engine initialized');
  }

  function resize() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  /**
   * Fire a confetti burst.
   * @param {'small'|'medium'|'big'} size - Burst intensity
   */
  function fire(size = 'small') {
    if (!canvas || !ctx) return;

    const counts = { small: 30, medium: 60, big: 120 };
    const count = counts[size] || 30;

    // Spawn particles from top-center with spread
    for (let i = 0; i < count; i++) {
      const angle = (Math.random() * Math.PI) - (Math.PI / 2); // upward spread
      const speed = 4 + Math.random() * 8;
      const x = canvas.width * (0.3 + Math.random() * 0.4);
      const y = canvas.height * 0.3 + Math.random() * canvas.height * 0.2;

      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
        vy: -Math.abs(Math.sin(angle) * speed) - 2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 4 + Math.random() * 6,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        gravity: 0.12 + Math.random() * 0.08,
        life: 1.0,
        decay: 0.008 + Math.random() * 0.006,
        shape: Math.random() > 0.5 ? 'rect' : 'circle',
      });
    }

    if (!animating) {
      animating = true;
      animate();
    }
  }

  function animate() {
    if (!ctx || particles.length === 0) {
      animating = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles = particles.filter(p => {
      p.x += p.vx;
      p.vy += p.gravity;
      p.y += p.vy;
      p.rotation += p.rotSpeed;
      p.life -= p.decay;
      p.vx *= 0.99;

      if (p.life <= 0 || p.y > canvas.height + 20) return false;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      return true;
    });

    requestAnimationFrame(animate);
  }

  return { init, fire };
})();
