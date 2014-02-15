class ApplicationController < ActionController::Base
  protect_from_forgery
  before_filter :get_token

  # config.cache_store = :redis_store, "redis://redistogo:720ecf0341dfca9cf980f80ed6be9b38@koi.redistogo.com:9427/0/cache", { expires_in: 9000.minutes }

  def index
  	@title = "Allen Ginsberg site, by the Allen Ginsberg Project."
  	@appPath = "http://localhost:8080/"
    @S3imgURL = "https://allenginsberg.s3.amazonaws.com"
  	if Rails.env.production?
	  	@appPath = "http://www.allenginsberg.com/"
      @S3imgURL = ""
	  end
	end

	def get_token
		@token = Locomotive::Account.create_api_token(AllenGinsbergOrg, 'ghanpatel@gmail.com', 'ag-vortexSutra1', '02ac122d79a9c62ca29c0fa1459cf2af107e7b01' )
	end

end