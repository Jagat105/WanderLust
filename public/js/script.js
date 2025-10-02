(() => {
  'use strict'

  // Fetch all forms with .needs-validation
  const forms = document.querySelectorAll('.needs-validation');


Array.from(forms).forEach(form => {
  form.addEventListener('submit', event => {
    const desc = form.querySelector('#description')
    if (desc && desc.value.trim().length < 20) {
      desc.setCustomValidity('Description too short')
    } else if (desc) {
      desc.setCustomValidity('')
    }

    const comment = form.querySelector('#comment')
    if (comment) {
      if (comment.value.trim() === '') {
        comment.setCustomValidity('Please add a comment')  
      } else if (comment.value.trim().length < 5) {
        comment.setCustomValidity('Comment too short')     
      } else {
        comment.setCustomValidity('')                       
      }
    }

    if (!form.checkValidity()) {
      event.preventDefault()
      event.stopPropagation()
    }

    form.classList.add('was-validated')
  }, false)




    // Real-time validation
    form.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('input', () => {
        if (field.checkValidity()) {
          field.classList.remove('is-invalid')
          field.classList.add('is-valid')
        } else {
          field.classList.remove('is-valid')
          field.classList.add('is-invalid')
        }
      })
    })

    // Reset feedback
    form.addEventListener('reset', () => {
      form.classList.remove('was-validated')
      form.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
        el.classList.remove('is-valid', 'is-invalid')
      })
    })
  })
})()





//toggle button
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("switchCheckDefault");

  toggle.addEventListener("change", function() {
    const showTax = this.checked;

    document.querySelectorAll(".listing-card").forEach(card => {
      const priceEl = card.querySelector(".listing-price");
      const taxEl = card.querySelector(".tax-info");
      const base = parseFloat(priceEl.dataset.base) || 0;

      if (showTax) {
        priceEl.innerText = "₹" + (base * 1.18).toLocaleString("en-IN");
        taxEl.style.display = "inline";
      } else {
        priceEl.innerText = "₹" + base.toLocaleString("en-IN");
        taxEl.style.display = "none";
      }
    });
  });
});

