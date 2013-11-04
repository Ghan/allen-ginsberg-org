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

        if params.has_key?(:reset_cache)
          Rails.cache.clear
          @content_entries = "cleared"
        end

        # At This Time (for Archive detail)
        if params.has_key?(:at_this_time)
          in_cache = Rails.cache.read("at_this_time/"+params[:at_this_time])
          if in_cache
            at_this_time_data = in_cache
            message = "hit"
          else
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
            at_this_time_data = @new_content_entries.slice(0, 3)
            message = "miss"
            
            Rails.cache.write("at_this_time/"+params[:at_this_time], at_this_time_data, expires_in: 0)
          end
          @content_entries = {
              "cache" => message,
              "data" => at_this_time_data
              }
        end

        # Similar Work - get published work similar to geo, notable, or date
        if params.has_key?(:similar_work)
          in_cache = Rails.cache.read("similar_work/"+params[:geo]+"/"+params[:notable]+"/"+params[:date])
          if in_cache
            similar_work_data = in_cache
            message = "hit"
          else
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
                      "imageThumb" => (entry.thumbnail_image.url ? entry.thumbnail_image.url : "/assets/blank.png")
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
                      "imageThumb" => (entry.thumbnail_image.url ? entry.thumbnail_image.url : "/assets/blank.png")
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
                  "imageThumb" => (entry.thumbnail_image.url ? entry.thumbnail_image.url : "/assets/blank.png")
                }
                @new_content_entries.push(add)
              end
            }
            similar_work_data = @new_content_entries.slice(0, 3)
            message = "miss"
            
            Rails.cache.write("similar_work/"+params[:geo]+"/"+params[:notable]+"/"+params[:date], similar_work_data, expires_in: 0)
          end
          @content_entries = {
              "cache" => message,
              "data" => similar_work_data
              }
        end

        # Items in Archive (Publish Work detail)
        if params.has_key?(:items_in_archive)
          in_cache = Rails.cache.read("items_in_archive/"+params[:items_in_archive])
          if in_cache
            items_in_archive_data = in_cache
            message = "hit"
          else
            @items = params[:items_in_archive].split("|")

            @new_content_entries = []
            @content_entries.each{ |entry|
              @items.each{ |i|
                if entry._slug == i
                  item = { "id" => entry.id,
                          "slug" => entry._slug,
                          "archive_type" => entry.archive_type._slug,
                          "title" => entry.title, 
                          "image" => (entry.file_slash_image.url || "/assets/blank.png")
                        }
                  @new_content_entries.push(item)
                end
              }
            }
            items_in_archive_data = @new_content_entries
            message = "miss"
            
            Rails.cache.write("items_in_archive/"+params[:items_in_archive], items_in_archive_data, expires_in: 0)
          end
          @content_entries = {
              "cache" => message,
              "data" => items_in_archive_data
              }
        end

        # Published In (Archive Items detail)
        if params.has_key?(:published_in)
          in_cache = Rails.cache.read("published_in/"+params[:published_in])
          if in_cache
            published_in_data = in_cache
            message = "hit"
          else
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
                      "imageThumb" => (entry.thumbnail_image.url ? entry.thumbnail_image.url : "/assets/blank.png")
                    }
                  @new_content_entries.push(item)
                end
              }
            }
            published_in_data = @new_content_entries
            message = "miss"
            
            Rails.cache.write("published_in/"+params[:published_in], published_in_data, expires_in: 0)
          end
          @content_entries = {
              "cache" => message,
              "data" => published_in_data
              }
        end

        # Similar Items in Archive (Archive Detail)
        if params.has_key?(:similar_archive_items)
          in_cache = Rails.cache.read("similar_archive_items/"+params[:id])
          if in_cache
            similar_archive_items_data = in_cache
            message = "hit"
          else
            @id = params[:id]
            @geo = params[:geo]
            @notable = params[:notable]
            @misc = params[:misc]
            @date = Date.strptime(params[:date], '%m/%d/%Y').year
            @date_range = 4

            @new_content_entries = []
            @content_entries.each{ |entry|
              unless entry.geo.empty?
                entry.geo.each{ |g|
                  if g._slug == @geo
                    add = { "id" => entry.id,
                          "slug" => entry._slug,
                          "archive_type" => entry.archive_type._slug,
                          "title" => entry.title, 
                          "image" => (entry.file_slash_image.url ? entry.file_slash_image.url : "/assets/blank.png")
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
                          "image" => (entry.file_slash_image.url ? entry.file_slash_image.url : "/assets/blank.png")
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
                          "image" => (entry.file_slash_image.url ? entry.file_slash_image.url : "/assets/blank.png")
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
                          "image" => (entry.file_slash_image.url ? entry.file_slash_image.url : "/assets/blank.png")
                        }
                @new_content_entries.push(add)
              end
            }
            similar_archive_items_data = @new_content_entries.slice(0, 7)
            message = "miss"
            
            Rails.cache.write("similar_archive_items/"+params[:id], similar_archive_items_data, expires_in: 0)
          end
          @content_entries = {
              "cache" => message,
              "data" => similar_archive_items_data
              }
        end

        # Other Classes in Series
        if params.has_key?(:other_class_list)
          in_cache = Rails.cache.read("other_class_list/"+params[:other_class_list])
          if in_cache
            other_class_list_data = in_cache
            message = "hit"
          else
            @id = params[:other_class_list]
            @new_content_entries = []
            @content_entries.each{ |entry|
              if entry.is_this_a_lecture_and_part_of_a_class_which_one_id == @id
                # puts entry.is_this_a_lecture_and_part_of_a_class_which_one_id
                entry = { "id" => entry.id,
                          "slug" => entry._slug,
                          "archive_type" => entry.archive_type._slug,
                          "title" => entry.title
                        }
                @new_content_entries.push(entry)
              end
            }
            other_class_list_data = @new_content_entries
            message = "miss"
            
            Rails.cache.write("other_class_list/"+params[:other_class_list], other_class_list_data, expires_in: 0)
          end
          @content_entries = {
              "cache" => message,
              "data" => other_class_list_data
              }
        end

        # Timeline - id, date, lifeline_snippet, chronological_addenda_snippet, title, geo, notables  
        if params.has_key?(:timeline)
          # Rails.cache.clear
          in_cache = Rails.cache.read("timeline")
          if in_cache
            timeline_data = in_cache
            message = "hit"
          else
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
            timeline_data = @new_content_entries
            message = "miss"
            
            Rails.cache.write("timeline", timeline_data, expires_in: 0)
          end
          @content_entries = {
              "cache" => message,
              "data" => timeline_data
              }
        end

        # Published Work index - id, type, name, publisher, date, thumbnail_image
        if params.has_key?(:work_type)
          @content_entries = @content_entries.select { |entry| entry.type._slug == params[:work_type] }
        end

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
                        "original_image" => (entry.thumbnail_image.url ? entry.thumbnail_image.url : "/assets/blank.png")
                        # "notable" => entry.notable,
                        # "geo" => entry.geo,
                        # "misc_tag" => entry.misc_tag,
                        # "imageThumb" => (entry.thumbnail_image.url ? Locomotive::Dragonfly.resize_url(entry.thumbnail_image.url, '250x300') : "/assets/blank.png")
                        # "imageThumb" => (entry.thumbnail_image.url ? Locomotive::Dragonfly.scaled_image_url("https://allenginsberg.s3.amazonaws.com"+entry.thumbnail_image.url, '250x300') : "/assets/blank.png")
                        # "imageThumb" => "https://allenginsberg.s3.amazonaws.com"+(entry.thumbnail_image.url ? entry.thumbnail_image.url : "/assets/blank.png")
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
        if params.has_key?(:arch_type)
          @content_entries = @content_entries.select { |entry| entry.archive_type._slug == params[:arch_type] }
        end

        if params.has_key?(:archive_index)
          in_cache = Rails.cache.read("archive_index"+params[:arch_type])
          if in_cache
            archive_data = in_cache
            message = "hit"
          else
            @new_content_entries = {"Miscellaneous" => []}
            if params[:arch_type] == "lecture"
              @content_entries.each{ |entry|
                series = ( entry.is_this_a_lecture_and_part_of_a_class_which_one || "Miscellaneous" )
                new_entry = { "id" => entry.id,
                          "slug" => entry._slug, 
                          "archive_type" => entry.archive_type._slug,
                          "title" => entry.title, 
                          "date" => entry.date_item_was_created,
                          "original_file" => ( entry.file_slash_image.url || "/assets/blank.png" ),
                          "lecture_series" => ( entry.is_this_a_lecture_and_part_of_a_class_which_one || "Miscellaneous" )
                          }
                if @new_content_entries.has_key?(series)
                  @new_content_entries[series].push(new_entry)
                else
                  @new_content_entries[series] = [new_entry]
                end
              }
            else
              @content_entries.each{ |entry|
                new_entry = { "id" => entry.id,
                            "slug" => entry._slug, 
                            "archive_type" => entry.archive_type._slug,
                            "title" => entry.title, 
                            "date" => entry.date_item_was_created,
                            "original_file" => ( entry.file_slash_image.url || "/assets/blank.png" ),
                            "lecture_series" => ( entry.is_this_a_lecture_and_part_of_a_class_which_one || "none" )
                            }
                # new_entry.merge!(:file_slash_image => (entry.file_slash_image.url ? Locomotive::Dragonfly.resize_url("https://allenginsberg.s3.amazonaws.com"+(entry.file_slash_image.url), '200x200#') : "/assets/blank.png"))
                @new_content_entries.push(new_entry)
              }
            end

            archive_data = @new_content_entries
            message = "miss"
            
            Rails.cache.write("archive_index"+params[:arch_type], archive_data, expires_in: 0)
          end

          @content_entries = {
              "cache" => message,
              "data" => archive_data
              }
        end

        # Next Page (archive detail)
        if params.has_key?(:next_page)

          in_cache = Rails.cache.read("next_page/"+params[:next_page])
          if in_cache
            next_page_data = in_cache
            message = "hit"
          else
            next_page_data = @content_entries[0]._slug
            @content_entries.each_with_index { |(key,value),index| 
              if key.id.to_s == params[:next_page]
                next_page_data = @content_entries[index+1]._slug
              end
            }
            message = "miss"
            
            Rails.cache.write("next_page/"+params[:next_page], next_page_data, expires_in: 0)
          end
          @content_entries = {
              "cache" => message,
              "data" => next_page_data
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

        respond_with @content_entries
      end

      def show
        # work detail
        if @content_type.slug == 'published_work'
          @new_content_entry = { "content" => @content_entry, "image" => (@content_entry.thumbnail_image.url ? @content_entry.thumbnail_image.url : "/assets/blank.png") }
          @content_entry = @new_content_entry
        end
        #archive item
        if @content_type.slug == 'archive_items'
          @new_content_entry = { "content" => @content_entry, "image" => (@content_entry.file_slash_image.url ? @content_entry.file_slash_image.url : "/assets/blank.png") }
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