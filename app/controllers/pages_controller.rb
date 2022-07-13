class PagesController < ApplicationController
  after_action :set_status
  def home
    redirect_to new_user_session_path unless current_user
  end

  private

  def set_status
    current_user.update!(status: User.statuses[:offline]) if current_user
  end
end
