# This migration comes from locomotive (originally 20130511121956)
class GenerateChecksumForThemeAssets < MongoidMigration::Migration
  def self.up
    Locomotive::ThemeAsset.all.each do |asset|
      asset.send(:calculate_checksum)

      puts "[#{asset.send(:safe_source_filename)}] #{asset.checksum}"

      asset.save!
    end
  end

  def self.down
  end
end