//
//  EHMProfilePicTableViewCell.m
//  eHireMe-iOS
//
//  Created by Mac Liu on 2/29/16.
//  Copyright © 2016 eHireMe. All rights reserved.
//

#import "EHMProfilePicTableViewCell.h"

@implementation EHMProfilePicTableViewCell

- (void)awakeFromNib {
    // Initialization code
    self.profileImageView.layer.cornerRadius = self.profileImageView.frame.size.width / 2.0f;
    self.profileImageView.clipsToBounds = YES;
    self.profileImageView.contentMode = UIViewContentModeScaleAspectFill;
    self.profileImageView.layer.borderColor = [UIColor whiteColor].CGColor;
    self.profileImageView.backgroundColor = [UIColor colorWithWhite:0.9 alpha:0.5];
    self.profileImageView.layer.borderWidth = 2.0f;

}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated {
    [super setSelected:selected animated:animated];

    // Configure the view for the selected state
}

@end
