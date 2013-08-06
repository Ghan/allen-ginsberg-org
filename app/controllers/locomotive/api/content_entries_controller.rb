module Locomotive
  module Api
    class ContentEntriesController < BaseController
      def index
        @content_entries = @content_entries.order_by([content_type.order_by_definition])
        respond_with @content_entries
      end
    end
  end
end