import './style.css'

/* ──────────────────────────────────────────────
   NAVBAR SCROLL EFFECT
   ────────────────────────────────────────────── */

const nav = document.getElementById('navbar')
let lastScroll = 0

window.addEventListener('scroll', () => {
    const y = window.scrollY
    if (y > 40) {
        nav.classList.add('scrolled')
    } else {
        nav.classList.remove('scrolled')
    }
    lastScroll = y
}, { passive: true })

/* ──────────────────────────────────────────────
   MOBILE NAV TOGGLE
   ────────────────────────────────────────────── */

const mobileToggle = document.getElementById('mobile-toggle')
const mobileNav = document.getElementById('mobile-nav')
const mobileClose = document.getElementById('mobile-close')

mobileToggle?.addEventListener('click', () => {
    mobileNav.classList.add('open')
    document.body.style.overflow = 'hidden'
})

mobileClose?.addEventListener('click', () => {
    mobileNav.classList.remove('open')
    document.body.style.overflow = ''
})

mobileNav?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileNav.classList.remove('open')
        document.body.style.overflow = ''
    })
})

/* ──────────────────────────────────────────────
   SCROLL REVEAL (IntersectionObserver)
   ────────────────────────────────────────────── */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

if (!prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible')
                revealObserver.unobserve(entry.target)
            }
        })
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-stagger').forEach(el => {
        revealObserver.observe(el)
    })
} else {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-stagger').forEach(el => {
        el.classList.add('visible')
    })
}

/* ──────────────────────────────────────────────
   STAT COUNTER ANIMATION
   ────────────────────────────────────────────── */

function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10)
    const suffix = el.getAttribute('data-suffix') || ''
    const prefix = el.getAttribute('data-prefix') || ''
    const duration = 1800
    const start = performance.now()

    function tick(now) {
        const elapsed = now - start
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
        const current = Math.round(eased * target)
        el.textContent = prefix + current.toLocaleString() + suffix
        if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
}

const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target)
            statObserver.unobserve(entry.target)
        }
    })
}, { threshold: 0.5 })

document.querySelectorAll('[data-count]').forEach(el => {
    statObserver.observe(el)
})

/* ──────────────────────────────────────────────
   FAQ ACCORDION
   ────────────────────────────────────────────── */

document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item')
        const wasOpen = item.classList.contains('open')

        // Close all + reset aria
        document.querySelectorAll('.faq-item').forEach(i => {
            i.classList.remove('open')
            i.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false')
        })

        // Toggle clicked
        if (!wasOpen) {
            item.classList.add('open')
            btn.setAttribute('aria-expanded', 'true')
        }
    })
})

/* ──────────────────────────────────────────────
   CHATBOT WIDGET
   ────────────────────────────────────────────── */

const chatFab = document.getElementById('chat-fab')
const chatPanel = document.getElementById('chat-panel')
const chatClose = document.getElementById('chat-close')

chatFab?.addEventListener('click', () => {
    const isOpen = chatPanel.classList.contains('open')
    chatPanel.classList.toggle('open')
    chatFab.innerHTML = isOpen ? chatIconSVG : closeIconSVG
})

chatClose?.addEventListener('click', () => {
    chatPanel.classList.remove('open')
    chatFab.innerHTML = chatIconSVG
})

const chatIconSVG = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>`
const closeIconSVG = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`

// Quick reply handler
document.querySelectorAll('.chat-option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const pathway = btn.textContent.trim()
        const chatBody = document.querySelector('.chatbot-body')

        // Show user's choice
        const userBubble = document.createElement('div')
        userBubble.className = 'chat-bubble !bg-primary !text-white !rounded-br-[4px] !rounded-bl-[16px] ml-auto w-fit max-w-[80%] mb-3'
        userBubble.textContent = pathway
        chatBody.appendChild(userBubble)

        // Hide options
        btn.closest('.chat-options')?.remove()

        // Bot reply
        setTimeout(() => {
            const botBubble = document.createElement('div')
            botBubble.className = 'chat-bubble'
            botBubble.innerHTML = `Great choice! Answer a few quick questions — then I'll submit your profile for consultant review and open your client portal checklist.<br><br><a href="/assessment/" class="btn-primary !text-sm !py-2 !px-4" onclick="document.getElementById('chat-panel').classList.remove('open')">Start Assessment</a>`
            chatBody.appendChild(botBubble)
            chatBody.scrollTop = chatBody.scrollHeight
        }, 600)
    })
})

/* ──────────────────────────────────────────────
   SMOOTH SCROLL FOR ANCHOR LINKS
   ────────────────────────────────────────────── */

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'))
        if (target) {
            e.preventDefault()
            const offset = 80
            const y = target.getBoundingClientRect().top + window.scrollY - offset
            window.scrollTo({ top: y, behavior: 'smooth' })
        }
    })
})
