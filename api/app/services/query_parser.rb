class LocationParser

  attr_reader :location

  def initialize(parameters)
    loc = parameters[:location]
    @location = loc || ""
  end

  def errors
    nil
  end

end

class StatsParser
  UNITS = ['by_minutes', 'by_hours', 'by_days']
  attr_reader :unit, :quantity

  def initialize(parameters)
    @stats = parameters[:stats]
    @unit = (stats && stats.split(':')[0]) || 'by_minutes'
    @quantity = (stats && stats.split(':')[1].to_i) || 6
  end

  def errors
    nil
  end
end

class TimeParser
  include Timestamp
  attr_reader :time_format, :unit, :quantity

  def initialize(parameters)
    @unit = obtain_time_unit(parameters)
    @since = nil
    @quantity = parameters[@unit]
    @time_format = time_stamp(parameters, @since)
  end

  def errors
    nil
  end

  private
    def obtain_time_unit(parameters)
      (parameters.keys & TIMES)[0]
    end

    def time_stamp(parameters, since)
      invoke(convert_time_to_method(parameters))
    end

    def invoke(time_method, since)
      if since
        method(time_method[:method]).call(time_method[:arg], since)
      else
        method(time_method[:method]).call(time_method[:arg])
      end
    end

    def convert_time_to_method(parameters)
      time = (parameters.keys & TIMES)[0]
      {
        method: ('past_' + time.to_s).to_sym,
        arg: parameters[time].to_i
      }
    end
end

class QueryParser
  attr_reader :time, :stats, :location

  def initialize(parameters)
    @parameters = convert_string_hash_to_sym_hash(parameters)
    @time = TimeParser.new(@parameters)
    @stats = StatsParser.new(@parameters)
    @location = LocationParser.new(@parameters)

    @parsers = [@time, @stats, @location]
  end

  def errors?
    @parsers.reduce(false) { |a, e| e.errors || a }
  end

  def errors
    @parsers.map(&:errors)
  end

  private
    def convert_string_hash_to_sym_hash(hash)
      hash.keys.reduce({}) {|a,e| a[e.to_sym] = hash[e]; a}
    end
end