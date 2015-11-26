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

$p('rm -rf publish').on 'exit',->
  copy()
  $p('npm run compile',[],{}).out()
  .then('git init',[],{cwd: 'publish'}).out()
  .then('git remote add origin git@github.com:gaogao1030/QiniuLiveDemo.git',[],{cwd: 'publish'}).out()
  .then('git checkout -b "publish"',[],{cwd: 'publish'}).out()
  .then('git add .',[],{cwd: 'publish'}).out()
  .then('git commit -m "update"',[],{cwd: 'publish'}).out()
  .then('git push origin publish" -f',[],{cwd: 'publish'}).out()
