class VibesController < ApplicationController
  include VibesHelper
  include ParameterSanity
  include Timestamp

  protect_from_forgery
  after_filter :cors_set_access_control_headers

  def test
    q_parser = QueryParser.new(check_params)
    render json: q_parser.errors
  end

  def quick_search
    parameters = convert_string_hash_to_sym_hash(check_params)
    # prev_params = cookies[:test].nil? ? {} : convert_string_hash_to_sym_hash(JSON.parse(cookies[:test]))
    parameters[:epoch] = Time.now.to_i
    parameters[:order_by] = 'sentiment'

    if sanity_check_passed?(parameters)
      render json: process_search2(parameters, {})
    else
      render json: handle_jsonp({ errors: sanity_violations(parameters), params: params })
    end
  end

  def big_search
    parameters = convert_string_hash_to_sym_hash(check_params)
    parameters[:epoch] = Time.now.to_i
    parameters[:order_by] = 'sentiment'
    # changes = determine_changes(get_prev_params, parameters)

    if sanity_check_passed?(parameters)
      render json: process_search(parameters)
    else
      render json: handle_jsonp({ errors: sanity_violations(parameters), params: params })
    end
  end

  def results
    puts params
    unit = {
      type: params[:type].to_sym,
      quantity: params[:quantity].to_i
    }
    result = Tweet.statistics(unit)
    render json: result
  end

  private
    def get_prev_params
      cookies[:vibes].nil? ? {} : convert_string_hash_to_sym_hash(JSON.parse(cookies[:vibes]))
    end

    def check_params
      params.permit(:q, :range,
                    :seconds, :minutes, :hours, :days, :weeks, :months, :years,
                    :location, :stats, :since, :from)
    end

    def handle_jsonp(data)
      cb = params['callback']
      if cb
        cb + '(' + data.to_json + ');'
      else
        data
      end
    end

    def process_search(parameters)
      batches = []
      meta = nil
      # Consider implementing a user token facility that identifies the request.
      BackgroundJobsController.run(parameters)
      []
    end

    def process_search2(parameters, changes)
      watsonApi = WatsonTwitterApi.new('', parameters, changes)

      results, parameters[:next_call] = watsonApi.get
      cookies[:vibes] = {value: parameters.to_json}

      handle_jsonp([parameters[:next_call], changes, results])
    end

    def cors_set_access_control_headers
      headers['Access-Control-Allow-Origin'] = '*'
      headers['Access-Control-Allow-Methods'] = 'POST, PUT, DELETE, GET, OPTIONS'
      headers['Access-Control-Request-Method'] = '*'
      headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
      headers['Access-Control-Allow-Credentials'] = 'true'
    end
end