# This file provided by Facebook is for non-commercial testing and evaluation
# purposes only. Facebook reserves all rights not expressly granted.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
# FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
# ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
# WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

require 'webrick'
require 'json'

port = ENV['PORT'].nil? ? 3030 : ENV['PORT'].to_i

puts "Server started: http://localhost:#{port}/"

root = File.expand_path '.'
server = WEBrick::HTTPServer.new Port: port, DocumentRoot: root

server.mount_proc '/api/tweets' do |req, res|
  sample_tweets = JSON.parse(File.read('./sample_tweets.json', encoding: 'UTF-8'))

  # always return json
  res['Content-Type'] = 'application/json'
  res['Cache-Control'] = 'no-cache'
  res.body = JSON.generate(sample_tweets)
end

trap('INT') { server.shutdown }

server.start
