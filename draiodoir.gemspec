# -*- encoding: utf-8 -*-
$:.push File.expand_path("../lib", __FILE__)
require "draiodoir/version"

Gem::Specification.new do |s|
  s.name        = "draiodoir"
  s.version     = Draiodoir::VERSION
  s.platform    = Gem::Platform::RUBY
  s.authors     = ["JJ Buckley"]
  s.email       = ["jj@bjjb.org"]
  s.homepage    = "http://jjbuckley.github.com/draiodoir"
  s.summary     = %q{A JavaScript multi-step form helper}
  s.description = %q{Draíodóir lets you take a regular HTML5 page, and turn it
    into a multi-step wizard.}

  s.rubyforge_project = "draiodoir"

  s.files         = `git ls-files`.split("\n")
  s.test_files    = `git ls-files -- {test,spec,features}/*`.split("\n")
  s.executables   = `git ls-files -- bin/*`.split("\n").map{ |f| File.basename(f) }
  s.require_paths = ["lib"]
end
