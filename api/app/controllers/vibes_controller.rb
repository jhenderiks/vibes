class VibesController < ApplicationController
  include VibesHelper
  include ParameterSanity

  protect_from_forgery
  after_filter :cors_set_access_control_headers

  def index
    render json: nil
  end

  def search
    parameters = convert_string_hash_to_sym_hash(check_params)
    # prev_params = cookies[:test].nil? ? {} : convert_string_hash_to_sym_hash(JSON.parse(cookies[:test]))
    parameters[:epoch] = Time.now.to_i
    parameters[:order_by] = 'sentiment'
    changes = determine_changes(get_prev_params, parameters)

    if sanity_check_passed?(parameters)
      render json: process_search(parameters, changes)
    else
      render json: handle_jsonp({ errors: sanity_violations(parameters), params: params })
    end
  end

  private
    def get_prev_params
      cookies[:vibes].nil? ? {} : convert_string_hash_to_sym_hash(JSON.parse(cookies[:vibes]))
    end

    def check_params
      params.permit(:q, :seconds, :minutes, :hours, :days, :weeks, :months,
                    :years, :range, :order_by, :locations, :gender,
                    :sentiment, :by_chunks_of, :in_slices_of, :from)
    end

    def handle_jsonp(data)
      cb = params['callback']
      if cb
        cb + '(' + data.to_json + ');'
      else
        data
      end
    end

    def process_search(parameters, changes)
      watsonApi = WatsonTwitterApi.new(parameters, changes)

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
