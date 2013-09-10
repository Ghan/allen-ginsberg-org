AllenGinsbergOrg::Application.configure do
  # Settings specified here will take precedence over those in config/application.rb

  # In the development environment your application's code is reloaded on
  # every request. This slows down response time but is perfect for development
  # since you don't have to restart the web server when you make code changes.
  config.cache_classes = false

  # Log error messages when you accidentally call methods on nil.
  config.whiny_nils = true

  # Show full error reports and disable caching
  config.consider_all_requests_local       = true
  config.action_controller.perform_caching = false

  # Don't care if the mailer can't send
  config.action_mailer.raise_delivery_errors = false

  # Print deprecation notices to the Rails logger
  config.active_support.deprecation = :log

  # Only use best-standards-support built into browsers
  config.action_dispatch.best_standards_support = :builtin

  # REDIS
  # config.action_dispatch.rack_cache = {
  #   metastore:   "redis://redistogo:720ecf0341dfca9cf980f80ed6be9b38@koi.redistogo.com:9427/1/metastore",
  #   entitystore: "redis://redistogo:720ecf0341dfca9cf980f80ed6be9b38@koi.redistogo.com:9427/1/entitystore"
  # }

  # Memcached
  # config.perform_caching = true
  # config.cache_store = :dalli_store, ENV["MEMCACHIER_SERVERS"], {
  #   :username        => ENV["MEMCACHIER_USERNAME"],
  #   :password        => ENV["MEMCACHIER_PASSWORD"],
  #   :value_max_bytes => 5242880 # 5MB
  # }
  # Do not compress assets
  config.assets.compress = false

  # Expands the lines which load the assets
  config.assets.debug = true
end
