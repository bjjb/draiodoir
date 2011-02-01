Draíodóir
=========

A javascript that turns web-pages into Wizards.


Usage
-----

  - Include (in a <script> tag) on your *HTML5* page
  - Make the form a Wizard, with `new Wizard("my_form");`

See [the Wiki][wiki] for more examples

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

[wiki]: https://github.com/jjbuckley/draiodoir/wiki
[validation]: http://www.w3.org/TR/html5/association-of-controls-and-forms.html#constraints
[bailitheoir]: http://jjbuckley.github.com/bailitheoir
[firefox]: http://www.mozilla.com/firefox
[chrome]: http://www.google.com/chrome
[safari]: http://www.apple.com/safari
[ie]: http://www.microsoft.com/internet_explorer
[w3c]: http://www.w3.org
[gpl]: http://www.gnu.org/licenses/gpl.html
