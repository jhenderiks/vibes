require "resque/tasks"
require 'resque/scheduler/tasks'
require 'resque/pool/tasks'

task "resque:setup" => :environment do
  Resque.before_fork = Proc.new {
    ActiveRecord::Base.establish_connection

    # Open the new separate log file
    logfile = File.open(File.join(Rails.root, 'log', 'resque.log'), 'a')

    # Activate file synchronization
    logfile.sync = true

    # Create a new buffered logger
    Resque.logger = ActiveSupport::Logger.new(logfile)
    Resque.logger.level = Logger::DEBUG
    Resque.logger.info "Resque Logger Initialized!"
  }
end

