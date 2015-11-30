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


fs.exists("publish/.git",(exists) ->
  if exists
    console.log "exists"
    $p('git reset --hard HEAD',[],{cwd: "publish"}).out()
    .then('git pull origin publish',[],{cwd: "publish"}).out()
    .then('git add .').out()
    .then('git commit -m "update"').out()
    .then('git push origin publish').out()
    #$p("git checkout publish",[],{cwd: 'publish'}).out()
    #.then('rm -rf publish/public').on 'exit',->
    #  copy()
    #  $p("git checkout publish").out()
    #  $p("git pull origin publish").out()
  else
    console.log "non exists"
    $p("mkdir publish").out()
    .then('git init',[],{cwd: 'publish'}).out()
    .then('git remote add -t "publish" origin git@github.com:gaogao1030/QiniuLiveDemo.git',[],{cwd: 'publish'}).out()
    .then('git fetch',[],{cwd: 'publish'}).out().on "exit", ->
      $p("git checkout publish",[],{cwd: 'publish'}).on "exit",->
        $p('rm -rf publish/pulic').on 'exit',->
          copy()
          $p('npm run compile',[],{}).out()
          .then('git add .',[],{cwd: 'publish'}).out()
          .then('git commit -m "update"',[],{cwd: 'publish'}).out()
          .then('git push origin publish',[],{cwd: 'publish'}).out()
)
