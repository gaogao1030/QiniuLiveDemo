glob = require 'glob'
ignore = require 'ignore'
fs = require 'fs-extra'
_ = require 'underscore'
child_process = require 'child_process'
$p = require 'procstreams'

copy = ->
  glob('public/**/*',(err,files)->
    ig = ignore().addPattern(['public/build'])
    files=ig.filter(files)
    _.each(files,(file)->
      fs.copy(file,"publish/#{file}",{})
    )
  )

$p('npm run compile',[],{},->
    copy()
  ).out().pipe('git init',[],{cwd: 'publish'}).and('git add .').and('git commit -m"update"')
