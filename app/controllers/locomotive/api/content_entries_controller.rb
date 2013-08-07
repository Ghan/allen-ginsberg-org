module Locomotive
  module Api
    class ContentEntriesController < BaseController
      def index
        @content_entries = @content_entries.order([content_type.order_by_definition])
        if params.has_key?(:geo)
        	# filter by geo
        	@content_entries.each { |entry| puts entry.geo }

        end
        # if params[:notable]
        # 	# filter by notable
        # 	@content_entries = @content_entries.select { |entry| entry.notable.include?(params[:notable]) }
        # end
        # if params[:misc_tag]
        # 	# filter by misc_tag
        # 	@content_entries = @content_entries.select { |entry| entry.misc_tag.include?(params[:misc_tag]) }
        # end
        # puts @content_entries.as_json
        respond_with @content_entries
      end
    end
  end
end