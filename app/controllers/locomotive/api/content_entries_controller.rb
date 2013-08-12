module Locomotive
  module Api
    class ContentEntriesController < BaseController
      def index
        @content_entries = @content_entries.order([content_type.order_by_definition])
        if params.has_key?(:geo)
        	# filter by geo
        	@content_entries = @content_entries.select { |entry| !!entry.geo.index{ |g| g._slug == params[:geo] } }
        end
        if params.has_key?(:notable)
        	# filter by notable
        	@content_entries = @content_entries.select { |entry| !!entry.notable.index{ |g| g._slug == params[:notable] } }
        end
        if params.has_key?(:misc_tag)
        	# filter by misc_tag
        	@content_entries = @content_entries.select { |entry| !!entry.notable.index{ |g| g._slug == params[:notable] } }
        end
        # date range
        if params.has_key?(:date)
        	end_date = params(:end_date) || params(:date)
        end
        # publish work type
        if params.has_key?(:work_type)
        	@content_entries = @content_entries.select { |entry| entry.type._slug == params[:work_type] }
        	@content_entries.each{ |entry|
        		puts entry.values_at(15)
        	}
        end

        # archive type

        # link type
        respond_with @content_entries
      end
    end
  end
end