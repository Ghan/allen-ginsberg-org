module Locomotive
  module Api
    class ContentEntriesController < BaseController
      def index
        @content_entries = @content_entries.order([content_type.order_by_definition])
        # geo
        if params.has_key?(:geo)
          @content_entries = @content_entries.select { |entry| !!entry.geo.index{ |g| g._slug == params[:geo] } }
        end
        # notable
        if params.has_key?(:notable)
          @content_entries = @content_entries.select { |entry| !!entry.notable.index{ |g| g._slug == params[:notable] } }
        end
        # misc_tag
        if params.has_key?(:misc_tag)
          @content_entries = @content_entries.select { |entry| !!entry.notable.index{ |g| g._slug == params[:notable] } }
        end
        # date range 
        if params.has_key?(:date)
          @start_year = Date.strptime(params[:date], '%m/%d/%Y').year
          if params.has_key?(:end_date)
            @end_year = Date.strptime(params[:end_date], '%m/%d/%Y').year
          else
            @end_year = @start_year
          end
          if params.has_key?(:date_range)
            @date_range = params[:date_range].to_i
          else
            @date_range = 3
          end
          @content_entries = @content_entries.select { |entry| entry[:date].year >= @start_year - @date_range and entry[:date].year <= @end_year + @date_range }
        end
        # publish work type
        if params.has_key?(:work_type)
          @content_entries = @content_entries.select { |entry| entry.type._slug == params[:work_type] }
        end
        # archive type
        if params.has_key?(:archive_type)
          @content_entries = @content_entries.select { |entry| entry.archive_type._slug == params[:archive_type] }
        end
        # link type
        if params.has_key?(:link_type)
          # @content_entries = @content_entries.select { |entry| entry.type._slug == params[:link_type] }
        end

        # Timeline - id, date, lifeline_snippet, chronological_addenda_snippet, title, geo, notables  
        if params.has_key?(:timeline)
          @new_content_entries = []
          @content_entries.each{ |entry|
            entry = { "id" => entry.id, 
                      "date" => entry.date, 
                      "lifeline_snippet" => entry.lifeline_snippet,
                      "chronological_addenda_snippet" => entry.chronological_addenda_snippet,
                      "title" => entry.title
                    }
            @new_content_entries.push(entry)
          }
          @content_entries = @new_content_entries
        end

        # Published Work index - id, type, name, publisher, date, thumbnail_image
        if params.has_key?(:works_index)
          @new_content_entries = []
          @content_entries.each{ |entry|
            entry = { "id" => entry.id, 
                      "type" => entry.type._slug,
                      "name" => entry.name, 
                      "publisher" => entry.publisher,
                      "date" => entry.date,
                      "thumbnail_image" => entry.thumbnail_image.url
                    }
            @new_content_entries.push(entry)
          }
          @content_entries = @new_content_entries
        end

        # Archive Items index - id, title, archive_type, file_slash_image
        if params.has_key?(:archive_index)
          @new_content_entries = []
          @content_entries.each{ |entry|
            entry = { "id" => entry.id, 
                      "archive_type" => entry.archive_type._slug,
                      "title" => entry.title, 
                      "file_slash_image" => entry.file_slash_image.url,
                      "date" => entry.date_item_was_created
                    }
            @new_content_entries.push(entry)
          }
          @content_entries = @new_content_entries
        end

        # Links page - 

        respond_with @content_entries
      end
    end
  end
end