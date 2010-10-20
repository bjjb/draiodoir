function Wizard(form, options) {
  if (typeof(form) == "string") {
    form = document.getElementById(form);
  }

  var self = this;
  form.addEventListener('submit', function(event) {
    if (!self.submit()) {
      event.preventDefault();
      return false;
    }
  }, false);

  form.addEventListener('wizard:step:hide', function(event) {
    console.log(event);
  }, false);

  form.addEventListener('wizard:step:show', function(event) {
    for (var i = 0; i < steps.length; i++) {
      if (i !== index) { steps[i].hide(); }
    }
  }, false);

  function getSubmit() {
    elements = form.getElementsByTagName('input');
    for (var i = 0; i < elements.length; i++) {
      if (elements[i].type == 'submit') {
        return elements[i];
      }
    }
  }

  function Step(fieldset, options) {
    this.name = fieldset.getAttribute('name');
    this.toString = function() {
      return "Step:" + this.name;
    };
    var fields = [];
    ['input', 'select', 'textarea'].forEach(function(tag) {
      elements = fieldset.getElementsByTagName(tag);
      for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener('invalid', function(event) {
          console.debug("%o is invalid! (%o)", this, this.validity);
          fieldset.valid = false;
        }, false);
        fields.push(elements[i]);
      }
    });
    this.hide = function() {
      fieldset.setAttribute('hidden', 'hidden');
      var event = document.createEvent('Events');
      event.initEvent('wizard:step:hide', true, true);
      return fieldset.dispatchEvent(event);
    };
    this.show = function() {
      fieldset.removeAttribute('hidden');
      var event = document.createEvent('Events');
      event.initEvent('wizard:step:show', true, true);
      return fieldset.dispatchEvent(event);
    };
    this.validate = function() {
      return fields.every(function(field) {
        return field.checkValidity();
      });
    };
  }

  var steps = [];
  var index = 0;
  var submit = getSubmit();
  var submit_text = submit.value;

  var fieldsets = form.getElementsByTagName('FIELDSET');
  for (var i = 0; i < fieldsets.length; i++) {
    var step = new Step(fieldsets[i]);
    step.hide();
    steps.push(step);
  }

  function showStep(index) {
    // TODO - set the label
    if (steps[index]) {
      steps[index].show();
    }
  };
  showStep(0);

  this.next = function() {
    if (steps[index]) {
      if (steps[index].validate()) {
        showStep(++index);
      }
      else {
        var event = document.createEvent('Events');
        event.initEvent('wizard:complete', true, true);
        form.dispatchEvent(event);
      }
    }
    else {
      var event = document.createEvent('Events');
      event.initEvent('wizard:invalid', true, true);
      form.dispatchEvent(event);
      return false;
    }
  };


  this.submit = function() {
    this.next();
    return index == steps.length;
  };
};

