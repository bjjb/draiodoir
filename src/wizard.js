/**
 * Draíodóir
 * =========
 *
 * Turns a HTML5 <form> into a wizard.
 *
 * The form *must* be marked up in a particular way, but it's pretty standard
 * HTML. Basically, each fieldset is a step in the form, and (by default) the
 * submit button is used as the control for moving forward. If the elements in
 * a fieldset don't validate (either on a modern browser, or using a compatible
 * JavaScript validation library, such as
 * bailitheoir(http://jjbuckley.github.com/bailitheoir), then the Wizard won't
 * allow you to progress.
 *
 * To hide all steps except the current, *Draíodóir* sets the "hidden"
 * attribute on the fieldset. Since most browsers can't handle this properly
 * yet, you need to either add a CSS rule such as
 *
 *   fieldset[hidden] { display: none; }
 *
 * or listen for the `wizard:step:show` and `wizard:step:hide` events, and
 * take appropriate action, such as setting a style attribute, on the event's
 * target.
 *
 * Usage
 * -----
 *
 *   form = document.getElementById('my_form');
 *   new Wizard(form);
 *
 * A new Wizard immediately hides all steps except the first one.
 *
 * You can pass in an options object as a second argumens (all optional):
 *
 * Options
 * -------
 *
 * next:: Identifies the control used to move forwards in the form. The
 *        default is the first "submit".
 * previous:: Identifies the control to be used to move backwards in the form.
 *            If a suitable element can't be found, it is created (as a
 *            <button>), and given the value "Back" (though you can override
 *            this with a label for any or all steps). An auto-generated
 *            previous control is inserted immediately before the "next"
 *            control.
 * labels:: Used to display text (or HTML) in certain elements at various
 *          steps. Valid values are "next" and "previous", which indicate the
 *          next and previous controls. Each value can either be a string
 *          (which is applied to the control for every step), or an object
 *          containing keys for the step names. For example:
 *
 *            new Wizard(form, {
 *              previous: 'back_button',
 *              labels: {
 *                next: {
 *                  step1: "To Step 2", step2: "Step 3, please", step3: "Go!",
 *                },
 *                previous: "Back"
 *              }
 *            });
 *
 *          The wizard has 3 steps, fieldsets with names "step1", "step2" and
 *          step3.  On step1, the next button says "To Step 2", and on step2,
 *          it says "Step 3, please". On the last step, it says "Go!". If this
 *          were left blank, it would revert to the original value of the
 *          submit field.
 *          On all steps (besides the first), the 'previous' control says
 *          "Back". It's hidden and disabled on the first step.
 *
 * Hook into the wizard by listening for the events it generates, or by using
 * its "next()", "previous()", "first()" and "last()" methods.
 *
 * Caveats
 * -------
 *
 * *Draíodóir* has been tested on Google Chrome 6.0.472.63, Mozilla Firefox
 * 3.6.10, and Sarari on iPhone OS v4.1. I hardly expect it to work in any
 * current version of Microsoft Explorer, but that will hopefully change. 
 * For more information, see the *Draíodóir* homepage at
 * http://jjbuckley.github.com/draiodoir. And feel free to fork the project,
 * and improve it!
 *
 * Events
 * ------
 *
 * These Events are fired by a Wizard:
 *
 * wizard:load::  the wizard is set up
 * wizard:next::  the next step is being shown
 * wizard:previous::  the previous step is being shown
 * wizard:first:: the first step is being shown
 * wizard:last::  the last step is being shown
 * wizard:invalid:: validation failed on the current step
 * wizard:valid::  validation passed on all steps
 * wizard:submit::  the form is being submitted
 * wizard:step:show:: a step is being shown
 * wizard:step:hide:: a step is being hidden
 *
 * Copyright
 * ---------
 *
 * Copyright (c) 2010 JJ Buckley (jj@bjjb.org)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
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
    // A step has been hidden.
  }, false);

  form.addEventListener('wizard:step:show', function(event) {
    for (var i = 0; i < steps.length; i++) {
      if (i !== index) {
        steps[i].hide();
      }
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
      event.step = this;
      return fieldset.dispatchEvent(event);
    };
    this.show = function() {
      fieldset.removeAttribute('hidden');
      var event = document.createEvent('Events');
      event.initEvent('wizard:step:show', true, true);
      event.step = this;
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
        var event = document.createEvent('Events');
        event.initEvent('wizard:next', true, true);
        event.step = steps[index];
        event.index = index;
        event.wizard = this;
        form.dispatchEvent(event);
        showStep(++index);
      }
      else {
        var event = document.createEvent('Events');
        event.initEvent('wizard:complete', true, true);
        event.step = steps[index];
        event.index = index;
        event.wizard = this;
        form.dispatchEvent(event);
      }
    }
    else {
      var event = document.createEvent('Events');
      event.initEvent('wizard:invalid', true, true);
      event.step = steps[index];
      event.index = index;
      event.wizard = this;
      form.dispatchEvent(event);
      return false;
    }
  };

  this.submit = function() {
    this.next();
    if (index == steps.length) {
      var event = document.createEvent('Events');
      event.initEvent('wizard:submit', true, true);
      event.wizard = this;
      event.index = index;
      event.step = steps[index];
      form.dispatchEvent(event);
      return true;
    }
    return false;
  };
};

