module Locomotive
  module Api
    class ContentEntriesController < BaseController

      load_and_authorize_resource({
        class:                Locomotive::ContentEntry,
        through:              :content_type,
        through_association:  :entries,
        find_by:              :find_by_id_or_permalink
      })

      def index
        @content_entries = @content_entries.order_by([content_type.order_by_definition])

        # Archive Items index - id, title, archive_type, file_slash_image
        if params.has_key?(:archive_index)
          # in_cache = Rails.cache.read("archive_index")
          # if in_cache
          #   archive_data = in_cache
          #   message = "hit"
          # else
          #   @new_content_entries = []
          #   @content_entries.each{ |entry|
          #     new_entry = { "id" => entry.id,
          #                 "slug" => entry._slug, 
          #                 "archive_type" => entry.archive_type._slug,
          #                 "title" => entry.title, 
          #                 "date" => entry.date_item_was_created
          #                 }
          #     new_entry.merge!(:file_slash_image => (entry.file_slash_image.url ? Locomotive::Dragonfly.resize_url("https://allenginsberg.s3.amazonaws.com"+(entry.file_slash_image.url), '200x200#') : "/assets/blank.png"))
          #     @new_content_entries.push(new_entry)
          #   }
          #   archive_data = @new_content_entries
          #   message = "miss"
            
          #   Rails.cache.write("archive_index", archive_data, expires_in: 0)
          # end

          # @content_entries = {
          #     "cache" => message,
          #     "data" => archive_data
          #     }
        end

        respond_with @content_entries
      end

      def show
        respond_with @content_entry, status: @content_entry ? :ok : :not_found
      end

      def create
        @content_entry.from_presenter(params[:content_entry] || params[:entry])
        @content_entry.save
        respond_with @content_entry, location: main_app.locomotive_api_content_entries_url(@content_type.slug)
      end

      def update
        @content_entry.from_presenter(params[:content_entry] || params[:entry])
        @content_entry.save
        respond_with @content_entry, location: main_app.locomotive_api_content_entries_url(@content_type.slug)
      end

      def destroy
        @content_entry.destroy
        respond_with @content_entry, location: main_app.locomotive_api_content_entries_url(@content_type.slug)
      end

      protected

      def content_type
        @content_type ||= current_site.content_types.where(slug: params[:slug]).first
      end

    end
  end
end