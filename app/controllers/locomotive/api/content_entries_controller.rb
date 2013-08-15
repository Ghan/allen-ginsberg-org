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

        # Timeline Photo - 
        if params.has_key?(:timeline_photo)
          # @timeline_id = params(:timeline_photo)
          # get timeline id's geo, notables, and date
          @geo = params[:tlgeo] || false
          @notables = params[:tlnotable]
          @date = params[:tldate]
          
          # # filter @content_entries on type = photo
          @content_entries = @content_entries.select { |entry| entry.archive_type._slug == 'photography' }
          @old_content_entries = @content_entries
          # filter @content_entries on date +/- 3 years
          if @date
            @start_year = Date.strptime(@date, '%m/%d/%Y').year
            @date_range = 3
            @content_entries = @content_entries.select { |entry| entry[:date_item_was_created].year >= @start_year - @date_range and entry[:date_item_was_created].year <= @start_year + @date_range }
          end
          if @content_entries.length == 0
            @content_entries = @old_content_entries
            if @geo
              @content_entries = @content_entries.select { |entry| !!entry.geo.index{ |g| g._slug == @geo } }
            end
          end
          if @content_entries.length == 0
            @content_entries = @old_content_entries
            if @notable
              @content_entries = @content_entries.select { |entry| !!entry.notable.index{ |g| g._slug == @notable } }
            end
          end

          # get first content entry, grab photo url, and send over
          @new_content_entries = []
          @content_entries.each{ |entry|
            entry = {
                      "title" => entry.title, 
                      "file_slash_image" => Locomotive::Dragonfly.resize_url("https://allenginsberg.s3.amazonaws.com"+(entry.file_slash_image.url || "/nothing.jpg"), '300x300#')
                    }
            @new_content_entries.push(entry)
          }
          @content_entries = @new_content_entries[0]
        end
        respond_with @content_entries
      end
    end
  end
end