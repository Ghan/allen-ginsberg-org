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

        # At This Time (for Archive detail)
        if params.has_key?(:at_this_time)
          @date = Date.strptime(params[:at_this_time], '%m/%d/%Y').year
          @date_range = 0
          
          @new_content_entries = []
          @content_entries.each{ |entry| 
            if entry[:date].year >= @date - @date_range and entry[:date].year <= @date + @date_range
              add = {
                "id" => entry.id, 
                "title" =>  entry.title,
                "date" => entry.date,
                "lifeline_snippet" => entry.lifeline_snippet,
                "slug" => entry._slug
                }
              @new_content_entries.push(add)
            end
          }
          @content_entries = @new_content_entries.slice(0, 3)
        end

        # get published work similar to geo, notable, or date
        if params.has_key?(:similar_work)
          @geo = params[:geo]
          @notable = params[:notable]
          @date = Date.strptime(params[:date], '%m/%d/%Y').year
          @date_range = 5

          @new_content_entries = []
          @content_entries.each{ |entry|
            unless entry.geo.empty?
              entry.geo.each{ |g|
                if g._slug == @geo
                  add = {
                    "id" => entry.id, 
                    "name" =>  entry.name,
                    "type" => entry.type._slug,
                    "slug" => entry._slug,
                    "imageThumb" => (entry.thumbnail_image.url ? Locomotive::Dragonfly.resize_url("https://allenginsberg.s3.amazonaws.com"+(entry.thumbnail_image.url), '200x200#') : "/assets/blank.png")
                  }
                  @new_content_entries.push(add)
                end
              }
            end
            unless entry.notable.empty?
              entry.notable.each{ |n|
                if n._slug == @notable
                  add = {
                    "id" => entry.id, 
                    "name" =>  entry.name,
                    "type" => entry.type._slug,
                    "slug" => entry._slug,
                    "imageThumb" => (entry.thumbnail_image.url ? Locomotive::Dragonfly.resize_url("https://allenginsberg.s3.amazonaws.com"+(entry.thumbnail_image.url), '200x200#') : "/assets/blank.png")
                  }
                  @new_content_entries.push(add)
                end
              }
            end
            if entry[:date].year >= @date - @date_range and entry[:date].year <= @date + @date_range
              add = {
                "id" => entry.id, 
                "name" =>  entry.name,
                "type" => entry.type._slug,
                "slug" => entry._slug,
                "imageThumb" => (entry.thumbnail_image.url ? Locomotive::Dragonfly.resize_url("https://allenginsberg.s3.amazonaws.com"+(entry.thumbnail_image.url), '200x200#') : "/assets/blank.png")
              }
              @new_content_entries.push(add)
            end
          }
          @content_entries = @new_content_entries.slice(0, 10)
        end

        # Items in Archive (Publish Work detail)
        if params.has_key?(:items_in_archive)
          @items = params[:items_in_archive].split("|")

          @new_content_entries = []
          @content_entries.each{ |entry|
            @items.each{ |i|
              if entry._slug == i
                item = { "id" => entry.id,
                        "slug" => entry._slug,
                        "archive_type" => entry.archive_type._slug,
                        "title" => entry.title, 
                        "image" => Locomotive::Dragonfly.resize_url("https://allenginsberg.s3.amazonaws.com"+(entry.file_slash_image.url || "/nothing.jpg"), '100x100#')
                      }
                @new_content_entries.push(item)
              end
            }
          }
          @content_entries = @new_content_entries
        end

        # Published In (Archive Items detail)
        if params.has_key?(:published_in)
          @items = params[:published_in].split("|")

          @new_content_entries = []
          @content_entries.each{ |entry|
            @items.each{ |i|
              if entry._slug == i
                item = {
                    "id" => entry.id, 
                    "name" =>  entry.name,
                    "type" => entry.type._slug,
                    "slug" => entry._slug,
                    "imageThumb" => (entry.thumbnail_image.url ? Locomotive::Dragonfly.resize_url("https://allenginsberg.s3.amazonaws.com"+(entry.thumbnail_image.url), '200x200#') : "/assets/blank.png")
                  }
                @new_content_entries.push(item)
              end
            }
          }
          @content_entries = @new_content_entries
        end

        # Similar Items in Archive (Archive Detail)
        if params.has_key?(:similar_archive_items)
          @id = params[:id]
          @geo = params[:geo]
          @notable = params[:notable]
          @misc = params[:misc]
          @date = Date.strptime(params[:date], '%m/%d/%Y').year
          @date_range = 5

          @new_content_entries = []
          @content_entries.each{ |entry|
            unless entry.geo.empty?
              entry.geo.each{ |g|
                if g._slug == @geo
                  add = { "id" => entry.id,
                        "slug" => entry._slug,
                        "archive_type" => entry.archive_type._slug,
                        "title" => entry.title, 
                        "image" => (entry.file_slash_image.url ? Locomotive::Dragonfly.resize_url("https://allenginsberg.s3.amazonaws.com"+(entry.file_slash_image.url), '100x100#') : "/assets/blank.png")
                      }
                  @new_content_entries.push(add)
                end
              }
            end
            unless entry.notable.empty?
              entry.notable.each{ |n|
                if n._slug == @notable
                  add = { "id" => entry.id,
                        "slug" => entry._slug,
                        "archive_type" => entry.archive_type._slug,
                        "title" => entry.title, 
                        "image" => (entry.file_slash_image.url ? Locomotive::Dragonfly.resize_url("https://allenginsberg.s3.amazonaws.com"+(entry.file_slash_image.url), '100x100#') : "/assets/blank.png")
                      }
                  @new_content_entries.push(add)
                end
              }
            end
            unless entry.misc_tags.empty?
              entry.notable.each{ |m|
                if m._slug == @misc
                  add = { "id" => entry.id,
                        "slug" => entry._slug,
                        "archive_type" => entry.archive_type._slug,
                        "title" => entry.title, 
                        "image" => (entry.file_slash_image.url ? Locomotive::Dragonfly.resize_url("https://allenginsberg.s3.amazonaws.com"+(entry.file_slash_image.url), '100x100#') : "/assets/blank.png")
                      }
                  @new_content_entries.push(add)
                end
              }
            end
            if entry[:date_item_was_created].year >= @date - @date_range and entry[:date_item_was_created].year <= @date + @date_range
              add = { "id" => entry.id,
                        "slug" => entry._slug,
                        "archive_type" => entry.archive_type._slug,
                        "title" => entry.title, 
                        "image" => (entry.file_slash_image.url ? Locomotive::Dragonfly.resize_url("https://allenginsberg.s3.amazonaws.com"+(entry.file_slash_image.url), '100x100#') : "/assets/blank.png")
                      }
              @new_content_entries.push(add)
            end
          }
          @content_entries = @new_content_entries.slice(0, 6)
        end

        # Other Classes in Series
        if params.has_key?(:other_class_list)
          @id = params[:other_class_list]
          @new_content_entries = []
          @content_entries.each{ |entry|
            if entry.is_this_a_lecture_and_part_of_a_class_which_one_id == @id
              puts entry.is_this_a_lecture_and_part_of_a_class_which_one_id
              entry = { "id" => entry.id,
                        "slug" => entry._slug,
                        "archive_type" => entry.archive_type._slug,
                        "title" => entry.title
                      }
              @new_content_entries.push(entry)
            end
          }
          @content_entries = @new_content_entries
        end

        # publish work type
        if params.has_key?(:work_type)
          @content_entries = @content_entries.select { |entry| entry.type._slug == params[:work_type] }
        end

        # Timeline - id, date, lifeline_snippet, chronological_addenda_snippet, title, geo, notables  
        if params.has_key?(:timeline)
          Rails.cache.clear
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
          in_cache = Rails.cache.read("works_index/"+params[:work_type])
          if in_cache
            works_data = in_cache
            message = "hit"
          else
            @new_content_entries = []
            @content_entries.each{ |entry|
              entry = { "id" => entry.id, 
                        "slug" => entry._slug,
                        "type" => entry.type._slug,
                        "name" => entry.name, 
                        "publisher" => entry.publisher,
                        "date" => entry.date,
                        # "notable" => entry.notable,
                        # "geo" => entry.geo,
                        # "misc_tag" => entry.misc_tag,
                        "imageThumb" => (entry.thumbnail_image.url ? Locomotive::Dragonfly.resize_url("https://allenginsberg.s3.amazonaws.com"+(entry.thumbnail_image.url), '250x300') : "/assets/blank.png")
                      }
              @new_content_entries.push(entry)
            }
            works_data = @new_content_entries
            message = "miss"
            
            Rails.cache.write("works_index/"+params[:work_type], works_data, expires_in: 0)
          end
          @content_entries = {
              "cache" => message,
              "data" => works_data
              }
        end

        # Archive Items index - id, title, archive_type, file_slash_image
        if params.has_key?(:archive_index)
          in_cache = Rails.cache.read("archive_index")
          if in_cache
            archive_data = in_cache
            message = "hit"
          else
            @new_content_entries = []
            @content_entries.each{ |entry|
              new_entry = { "id" => entry.id,
                          "slug" => entry._slug, 
                          "archive_type" => entry.archive_type._slug,
                          "title" => entry.title, 
                          "date" => entry.date_item_was_created
                          }
              new_entry.merge!(:file_slash_image => (entry.file_slash_image.url ? Locomotive::Dragonfly.resize_url("https://allenginsberg.s3.amazonaws.com"+(entry.file_slash_image.url), '200x200#') : "/assets/blank.png"))
              @new_content_entries.push(new_entry)
            }
            archive_data = @new_content_entries
            message = "miss"
            
            Rails.cache.write("archive_index", archive_data, expires_in: 0)
          end

          @content_entries = {
              "cache" => message,
              "data" => archive_data
              }
        end

        # Links page - 
        if params.has_key?(:links_page)
          in_cache = Rails.cache.read("links_page")
          if in_cache
            links_data = in_cache
            message = "hit"
          else
            @new_content_entries = []
            @content_entries.each{ |entry|
              @description = ( entry.description || "" )
              entry = { "id" => entry.id, 
                        "category" => entry.category.category,
                        "title" => entry.title,
                        "description" => @description,
                        "url" => entry.url
              }
              @new_content_entries.push(entry)
            }
            links_data = @new_content_entries
            message = "miss"
            
            Rails.cache.write("links_page", links_data, expires_in: 0)
          end

          @content_entries = {
              "cache" => message,
              "data" => links_data
              }
        end

        # # Timeline Photo - 
        # if params.has_key?(:timeline_photo)
        #   # @timeline_id = params(:timeline_photo)
        #   # get timeline id's geo, notables, and date
        #   @geo = params[:tlgeo] || false
        #   @notables = params[:tlnotable]
        #   @date = params[:tldate]
          
        #   # # filter @content_entries on type = photo
        #   @content_entries = @content_entries.select { |entry| entry.archive_type._slug == 'photography' }
        #   @old_content_entries = @content_entries
        #   # filter @content_entries on date +/- 3 years
        #   if @date
        #     @start_year = Date.strptime(@date, '%m/%d/%Y').year
        #     @date_range = 3
        #     @content_entries = @content_entries.select { |entry| entry[:date_item_was_created].year >= @start_year - @date_range and entry[:date_item_was_created].year <= @start_year + @date_range }
        #   end
        #   if @content_entries.length == 0
        #     @content_entries = @old_content_entries
        #     if @geo
        #       @content_entries = @content_entries.select { |entry| !!entry.geo.index{ |g| g._slug == @geo } }
        #     end
        #   end
        #   if @content_entries.length == 0
        #     @content_entries = @old_content_entries
        #     if @notable
        #       @content_entries = @content_entries.select { |entry| !!entry.notable.index{ |g| g._slug == @notable } }
        #     end
        #   end

        #   # get first content entry, grab photo url, and send over
        #   @new_content_entries = []
        #   @content_entries.each{ |entry|
        #     entry = {
        #               "title" => entry.title, 
        #               "file_slash_image" => Locomotive::Dragonfly.resize_url("https://allenginsberg.s3.amazonaws.com"+(entry.file_slash_image.url || "/nothing.jpg"), '300x300#')
        #             }
        #     @new_content_entries.push(entry)
        #   }
        #   @content_entries = @new_content_entries[0]
        # end

        respond_with @content_entries
      end

      def show
        # work detail
        if @content_type.slug == 'published_work'
          @new_content_entry = { "content" => @content_entry, "image" => (@content_entry.thumbnail_image.url ? Locomotive::Dragonfly.resize_url("https://allenginsberg.s3.amazonaws.com"+(@content_entry.thumbnail_image.url), '400x600') : "/assets/blank.png") }
          @content_entry = @new_content_entry
        end
        #archive item
        if @content_type.slug == 'archive_items'
          @new_content_entry = { "content" => @content_entry, "image" => (@content_entry.file_slash_image.url ? Locomotive::Dragonfly.resize_url("https://allenginsberg.s3.amazonaws.com"+(@content_entry.file_slash_image.url), '1000x1000') : "/assets/blank.png") }
          @content_entry = @new_content_entry
        end
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