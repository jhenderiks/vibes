class TimeParser
  include Timestamp

  def initialize(parameters)
    @unit = obtain_time_unit(parameters)
    @since = nil
    @quantity = parameters[@unit]
    @time_format = time_stamp(parameters, @since)
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

  def initialize(parameters)
    @parameters = convert_string_hash_to_sym_hash(parameters)
    @timeParser = TimeParser.new(@parameters)
    @statsParser = StatsParser.new(@parameters)
  end

  private
    def convert_string_hash_to_sym_hash(hash)
      hash.keys.reduce({}) {|a,e| a[e.to_sym] = hash[e]; a}
    end
end