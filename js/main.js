/* ==========================================================================
   Dr. Márcio Freitas - Interactive Logic, Google Maps Reviews & WhatsApp Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Navigation Drawer Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('is-active');
      const isExpanded = navMenu.classList.contains('is-active');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
      mobileToggle.innerHTML = isExpanded ? '✕' : '☰';
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.innerHTML = '☰';
      });
    });

    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('is-active') && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('is-active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.innerHTML = '☰';
      }
    });
  }

  // 2. FAQ Accordions
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(otherItem => otherItem.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // 3. Dynamic WhatsApp Link Builder
  const whatsappButtons = document.querySelectorAll('[data-whatsapp-procedure]');
  const phone = '554788566302'; // WhatsApp oficial Clínica Dr. Márcio Freitas (Jaraguá do Sul - SC)

  whatsappButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const procedure = btn.getAttribute('data-whatsapp-procedure') || 'Consulta';
      const pageSource = window.location.pathname.split('/').pop() || 'Home';

      const message = `Olá, Dr. Márcio Freitas! Vim pelo site (${pageSource}) e gostaria de agendar uma avaliação para ${procedure}. Poderia me informar os horários disponíveis em Jaraguá do Sul?`;
      const encodedMsg = encodeURIComponent(message);
      const targetUrl = `https://wa.me/${phone}?text=${encodedMsg}`;

      if (typeof window.gtag === 'function') {
        window.gtag('event', 'conversion', {
          'send_to': 'AW-CONVERSION-ID/whatsapp_click',
          'event_category': 'WhatsApp',
          'event_label': procedure
        });
      }

      window.open(targetUrl, '_blank');
    });
  });

  // 4. Agile Booking Form Submission
  const bookingForms = document.querySelectorAll('.form-agile');

  bookingForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.querySelector('[name="nome"]')?.value || '';
      const phoneVal = form.querySelector('[name="telefone"]')?.value || '';
      const procedure = (
        form.querySelector('[name="procedimento"]:checked') ||
        form.querySelector('select[name="procedimento"]') ||
        form.querySelector('input[name="procedimento"]')
      )?.value || 'Consulta';
      const email = form.querySelector('[name="email"]')?.value || '';
      const cidade = form.querySelector('[name="cidade"]')?.value || '';

      if (!name || !phoneVal) {
        alert('Por favor, preencha seu nome e telefone.');
        return;
      }

      let message = `Olá! Meu nome é ${name} (${phoneVal}). Gostaria de agendar uma avaliação sobre: ${procedure}.`;
      if (email) message += ` E-mail: ${email}.`;
      if (cidade) message += ` Cidade: ${cidade}.`;
      const encoded = encodeURIComponent(message);

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '✓ Redirecionando para WhatsApp...';

        setTimeout(() => {
          window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          form.reset();
        }, 800);
      }
    });
  });

  // 5. Procedure Cards Carousel Controls
  const carouselTrack = document.getElementById('carouselTrack');
  const carouselPrev = document.getElementById('carouselPrev');
  const carouselNext = document.getElementById('carouselNext');

  if (carouselTrack && carouselPrev && carouselNext) {
    const scrollAmount = 295;

    carouselNext.addEventListener('click', () => {
      carouselTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    carouselPrev.addEventListener('click', () => {
      carouselTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
  }

  // 6. Google Maps Real Reviews Rotator (5s interval, strictly >= 5 stars)
  const reviewsStack = document.getElementById('googleReviewsStack');
  if (reviewsStack) {
    const GOOGLE_MAPS_URL = 'https://www.google.com/maps/place/Cl%C3%ADnica+Dr.+M%C3%A1rcio+Freitas+%7C+Otorrinolaringologista+e+Rinoplastia+em+Jaragu%C3%A1+do+Sul,+SC/@-26.49258,-49.0809106,17z/data=!3m1!4b1!4m6!3m5!1s0x94de951c23e052c3:0x3265301fbfaa0f6d!8m2!3d-26.49258!4d-49.0783357!16s%2Fg%2F1tdzxwlr';
    const PLACE_ID = reviewsStack.getAttribute('data-place-id') || 'ChIJw1LgIxyV3pQRbQ-qvx8wZTI';
    const MIN_RATING = 4; // Evita avaliações baixas (mantém apenas 4 e 5 estrelas; todas abaixo são 5 estrelas)

    // Avaliações reais extraídas diretamente do Google Maps da Clínica Dr. Márcio Freitas (Jaraguá do Sul, SC)
    let googleReviewsPool = [
      {
        author: 'Maysa Bueno',
        rating: 5,
        time: 'Google Maps • ★ 5.0',
        avatar: 'assets/images/reviews/maysa-bueno.jpg',
        fallbackAvatar: 'https://lh3.googleusercontent.com/a-/ALV-UjVM8Gnn7_-pndsL3XngN4GAV8b3KUKHaJsShc2j9NW95IFNsXbOiQ=s120-c-rp-mo-br100',
        text: 'Fiz rinosseptoplastia e foi tudo perfeito! Do início ao fim, 100% de atenção. Trabalho bem executado e hoje minha autoestima está recuperada graças ao Dr Marcio 🙌🏼🩷 Preço justo.',
        url: 'https://www.google.com/maps/contrib/101304575645164469807/reviews?hl=pt-BR'
      },
      {
        author: 'Jorge Luis Moretti',
        rating: 5,
        time: 'Google Maps • ★ 5.0',
        avatar: 'assets/images/reviews/jorge-moretti.jpg',
        fallbackAvatar: 'https://lh3.googleusercontent.com/a/ACg8ocIg8LfC15mZf8fH3Yr5WC0W61m1VzDgPgWDiyNsyHeo96unGg=s120-c-rp-mo-br100',
        text: 'Excelência no atendimento, profissionalismo e comprometimento com o processo. E resultados além dos esperados. Tanto funcional quanto estético na rinoplastia quanto da sinusectomia.',
        url: 'https://www.google.com/maps/contrib/108440128155298447875/reviews?hl=pt-BR'
      },
      {
        author: 'Janice Breithaupt',
        rating: 5,
        time: 'Google Maps • ★ 5.0',
        avatar: 'assets/images/reviews/janice-breithaupt.jpg',
        fallbackAvatar: 'https://lh3.googleusercontent.com/a-/ALV-UjU4wk0Q7LI8DlKNd8KUjTFCaDhWNdnZ1BkN5IrhBdFuhWKGr0kKEw=s120-c-rp-mo-br100',
        text: 'Desde a recepção sempre fui muito bem atendida!! A gentileza, cuidados, atendimento, atenção, tudo perfeito! Dr. Márcio, profissional super competente e muito paciente em explicar os detalhes em cada procedimento!',
        url: 'https://www.google.com/maps/contrib/113863854700275520491/reviews?hl=pt-BR'
      },
      {
        author: 'Ivana Melo',
        rating: 5,
        time: 'Google Maps • ★ 5.0',
        avatar: 'assets/images/reviews/ivana-melo.jpg',
        fallbackAvatar: 'https://lh3.googleusercontent.com/a/ACg8ocIRFOc1vptiuAytwwuEakyRm2mH4SpjiM7aRc2ZvFKXnxX7cA=s120-c-rp-mo-br100',
        text: 'Uma experiência acolhedora e extremamente cuidadosa e profissional. Vale a pena estar em boas mãos, me senti em segurança.',
        url: 'https://www.google.com/maps/contrib/105394940374338078794/reviews?hl=pt-BR'
      },
      {
        author: 'Carla Fernandes',
        rating: 5,
        time: 'Google Maps • ★ 5.0',
        avatar: 'assets/images/reviews/carla-fernandes.jpg',
        fallbackAvatar: 'https://lh3.googleusercontent.com/a/ACg8ocLVNZ62Uz9U9OG7Fn0OXzMGRvzDaHeMufitOFdZJ8cLv7QRdg=s120-c-rp-mo-br100',
        text: 'Dr Marcio sempre muito profissional. Me atende desde 2007 com muita excelência e cuidado. Recomendo com certeza!',
        url: 'https://www.google.com/maps/contrib/115114068057500390921/reviews?hl=pt-BR'
      },
      {
        author: 'Paciente Verificado (Google)',
        rating: 5,
        time: 'Google Maps • ★ 5.0',
        avatar: 'assets/images/reviews/paciente-6.jpg',
        fallbackAvatar: 'https://lh3.googleusercontent.com/a/ACg8ocLdDz-EpFLTCtHKud9_wHBw0ncB9anQ3ZBVbOijpvgbYizDrA=s120-c-rp-mo-br100',
        text: 'Atendimento excelente, prioridade, atenção aos detalhes e ambiente super acolhedor. Equipe nota 10 em Jaraguá do Sul.',
        url: 'https://www.google.com/maps/contrib/111615071976624490588?hl=pt-BR'
      },
      {
        author: 'Paciente Verificado (Google)',
        rating: 5,
        time: 'Google Maps • ★ 5.0',
        avatar: 'assets/images/reviews/paciente-7.jpg',
        fallbackAvatar: 'https://lh3.googleusercontent.com/a/ACg8ocIiAK4c_NEHhxefaNVrY2f9yzcyivrTK_f0Z3clYteAWTgzCg=s120-c-rp-mo-br100',
        text: 'Excelente profissional e ótimo atendimento desde a recepção até o acompanhamento pós-operatório. Recomendo muito!',
        url: 'https://www.google.com/maps/contrib/107242611615995601354?hl=pt-BR'
      },
      {
        author: 'Paciente Verificado (Google)',
        rating: 5,
        time: 'Google Maps • ★ 5.0',
        avatar: 'assets/images/reviews/paciente-8.jpg',
        fallbackAvatar: 'https://lh3.googleusercontent.com/a-/ALV-UjWZO8jUKVG9qAeW9ecBSPVTQxPQd9NYHRpNH4LdJruHWhaglEs=s120-c-rp-mo-br100',
        text: 'Que Deus abençoe grandemente o Dr. Márcio e toda a sua equipe pelo cuidado, atenção e carinho em cada consulta.',
        url: 'https://www.google.com/maps/contrib/103775790003812426523?hl=pt-BR'
      }
    ];

    // Se a API Google Maps Places estiver carregada na página, busca ao vivo e filtra avaliações >= MIN_RATING
    if (window.google && window.google.maps && window.google.maps.places) {
      const dummyNode = document.createElement('div');
      const service = new window.google.maps.places.PlacesService(dummyNode);
      service.getDetails(
        { placeId: PLACE_ID, fields: ['reviews', 'rating', 'user_ratings_total'], language: 'pt-BR' },
        (place, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && place?.reviews?.length) {
            const liveHighReviews = place.reviews
              .filter(r => (r.rating || 0) >= MIN_RATING && r.text && r.text.trim().length > 15)
              .map(r => ({
                author: r.author_name || 'Paciente Google',
                rating: r.rating,
                time: r.relative_time_description ? `Google Maps • ${r.relative_time_description}` : 'Google Maps • ★ 5.0',
                avatar: r.profile_photo_url || 'assets/images/reviews/maysa-bueno.jpg',
                fallbackAvatar: 'assets/images/reviews/maysa-bueno.jpg',
                text: r.text.trim(),
                url: r.author_url || GOOGLE_MAPS_URL
              }));

            if (liveHighReviews.length >= 3) {
              googleReviewsPool = liveHighReviews;
            }
          }
        }
      );
    }

    // Filtra estritamente avaliações altas (>= 4 estrelas) evitando avaliações baixas
    const getFilteredReviews = () => googleReviewsPool.filter(r => (r.rating || 5) >= MIN_RATING);

    const cards = Array.from(reviewsStack.querySelectorAll('.rcard'));
    let currentIndex = 0;
    let rotationTimer = null;

    const renderReviewSlot = (card, reviewData) => {
      if (!card || !reviewData) return;
      const avatarEl = card.querySelector('.rcard__avatar');
      const nameEl = card.querySelector('.rcard__name') || card.querySelector('h4');
      const timeEl = card.querySelector('.rcard__time');
      const textEl = card.querySelector('.rcard__text') || card.querySelector('p');
      const starsEl = card.querySelector('.rcard__stars');

      card.setAttribute('href', reviewData.url || GOOGLE_MAPS_URL);

      if (avatarEl) {
        avatarEl.src = reviewData.avatar;
        avatarEl.alt = `Avaliação de ${reviewData.author} no Google Maps`;
        avatarEl.onerror = () => {
          if (reviewData.fallbackAvatar && avatarEl.src !== reviewData.fallbackAvatar) {
            avatarEl.src = reviewData.fallbackAvatar;
          }
        };
      }
      if (nameEl) nameEl.textContent = reviewData.author;
      if (timeEl) timeEl.textContent = reviewData.time || 'Google Maps';
      if (textEl) textEl.textContent = reviewData.text;
      if (starsEl) {
        const starCount = Math.max(4, Math.min(5, Math.round(reviewData.rating || 5)));
        starsEl.textContent = '★'.repeat(starCount);
        starsEl.setAttribute('aria-label', `${starCount} de 5 estrelas`);
      }
    };

    const rotateReviews = () => {
      const pool = getFilteredReviews();
      if (pool.length <= 3) return;

      currentIndex = (currentIndex + 1) % pool.length;

      cards.forEach((card, slotIdx) => {
        const nextReview = pool[(currentIndex + slotIdx) % pool.length];
        setTimeout(() => {
          card.classList.add('is-switching');
          setTimeout(() => {
            renderReviewSlot(card, nextReview);
            card.classList.remove('is-switching');
          }, 260);
        }, slotIdx * 90);
      });
    };

    const startRotation = () => {
      if (!rotationTimer) {
        rotationTimer = setInterval(rotateReviews, 5000);
      }
    };

    const stopRotation = () => {
      if (rotationTimer) {
        clearInterval(rotationTimer);
        rotationTimer = null;
      }
    };

    reviewsStack.addEventListener('mouseenter', stopRotation);
    reviewsStack.addEventListener('mouseleave', startRotation);

    startRotation();
  }
});
