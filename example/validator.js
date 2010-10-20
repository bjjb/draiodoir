/**
 * A basic implementation of the W3's HTML5 constraints.
 * (http://www.w3.org/TR/html5/association-of-controls-and-forms.html#constraints)
 *
 * Usage
 * -----
 *
 *   new Validator(form);
 *   form.addEventListener('invalid', function() {
 *     alert("Detected an invalid field!");
 *   }, false);
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
function Validator(form) {
  var fields = [];
  function Validator(field) {
    function Validity() {
      this.valueMissing = false;
      this.typeMismatch = false;
      this.patternMismatch = false;
      this.tooLong = false;
      this.rangeUnderflow = false;
      this.rangeOverflow = false;
      this.stepMismatch = false;
      this.customError = false;
      this.valid = true;
    };
    field.willValidate = !!(~['INPUT', 'SELECT', 'TEXTAREA'].indexOf(field.tagName));
    field.setCustomValidity = function(message) {
      if (message == "") {
        field.validity.customError = false;
      }
      else {
        field.validity.customError = true;
        field.validationMessage = message;
      }
    };
    field.checkValidity = function() {
      if (this.willValidate) {
        this.validity.valueMissing = (this.hasAttribute('required') && this.value.trim() == "");
        this.validity.typeMismatch = ((this.type == 'email' && this.value && !this.value.match(/.+@.+\..+/)) ||
          (this.type == 'number' && this.value && !this.value.match(/^\d+/)) ||
          (this.type == 'date' && false && this.value && !this.value.match(/\d{4}-\d{2}-\d{2}/)) ||
          (this.type == 'url' && this.value && !this.value.match(/.+\..+/)));
        this.validity.tooLong = (this.hasAttribute('maxlength') && this.value > this.getAttribute('maxlength'));
        this.validity.rangeUnderflow = (this.hasAttribute('min') && this.value < this.getAttribute('min'));
        this.validity.rangeOverflow = (this.type == 'number' && this.hasAttribute('max') && this.value < this.getAttribute('max'));
        this.validity.stepMismatch = false; // TODO
        this.valid = !(this.validity.valueMissing ||
            this.validity.typeMismatch ||
            this.validity.tooLong ||
            this.validity.rangeUnderflow ||
            this.validity.rangeOverflow ||
            this.validity.stepMismatch ||
            this.validity.customError);
        if (!this.valid) {
          var event = document.createEvent('Events');
          event.initEvent('invalid', true, true);
          field.dispatchEvent(event);
          return false;
        }
      }
      return true;
    };
    field.validity = new Validity();
    console.debug("Added a validator (%o) on %o", this, field);
  }
  ['input', 'select', 'textarea'].forEach(function(tag) {
    var elements = form.getElementsByTagName(tag);
    for (var i = 0; i < elements.length; i++) {
      new Validator(elements[i]);
    }
  });
}

