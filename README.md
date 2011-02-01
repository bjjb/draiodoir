Draíodóir
=========

A javascript that turns web-pages into Wizards.


Usage
-----

  - Include (in a `<script>` tag) on your *HTML5* page
  - Make the form a Wizard, with `new Wizard("my_form");`

Example
-------

    <!DOCTYPE html>
    <html>
      <head>
        <meta content-type='UTF-8'>
        <script type='text/javascript' src='wizard.js'></src>
        <script>
          addEventListener('load', function(e) {
            new Wizard('my_form');
          }, false);
        </script>
        <title>Draíodóir Test</title>
      </head>
      <body>
        <form id='my_form' action='javascript:alert("Submitting form");'>
          <fieldset>
            <label for='name'>Name</label>
            <input id='name' type='text' required>
          </fieldset>
          <fieldset>
            <label for='age'>Age</label>
            <input id='age' type='number' minimum='18' maximum='80' required>
          </fieldset>
          <input type='submit' value='Go'>
        </form>
      </body>
    </html>

Caveats
-------

*Draíodóir* relies on [validation][validation] being fully implemented by
the browser. This is almost never the case (as of this writing), so you'll
probably need to include another library which performs validation properly,
such as [Bailitheoir][bailitheoir].

The library is targeted, therefore, at the [more][firefox] [modern][chrome]
[browsers][safari], so don't expect it to work out of the box in [those][ie]
that are, err, less [standards][w3c] compliant.

Author(s)
---------

  - JJ Buckley <jj@bjjb.org>

Copyright
---------

This software is released under the [GPL][gpl], so feel free to steal and
destroy - just comply with the terms of that license. I accept no
responsibilty for anything.

[validation]: http://www.w3.org/TR/html5/association-of-controls-and-forms.html#constraints
[bailitheoir]: http://jjbuckley.github.com/bailitheoir
[firefox]: http://www.mozilla.com/firefox
[chrome]: http://www.google.com/chrome
[safari]: http://www.apple.com/safari
[ie]: http://www.microsoft.com/internet_explorer
[w3c]: http://www.w3.org
[gpl]: http://www.gnu.org/licenses/gpl.html
